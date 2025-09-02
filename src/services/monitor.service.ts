import { getRepository } from "typeorm";
import { Posicion } from "../entities/Posicion";
import { PosicionMetrica } from "../entities/PosicionMetrica";
import { EmpresaConfiguracion } from "../entities/EmpresaConfiguracion";
import { posicion_getOcupacion_DALC } from "../DALC/posiciones.dalc";
import { emailService } from "./email.service";

export class MonitorService {
    private timer?: NodeJS.Timer;

    public start(intervalMs = 300000) {
        if (!this.timer) {
            this.timer = setInterval(() => this.checkAll(), intervalMs);
        }
    }

    private async checkAll() {
        const configs = await getRepository(EmpresaConfiguracion).find();
        for (const cfg of configs) {
            await this.checkEmpresa(cfg);
        }
    }

    private async checkEmpresa(cfg: EmpresaConfiguracion) {
        const posiciones = await getRepository(Posicion).find();
        for (const pos of posiciones) {
            const ocupacion = await posicion_getOcupacion_DALC(pos.Id, { idEmpresa: cfg.IdEmpresa });
            const pctVol = pos.CapacidadTotalVolumenCm3 ? ocupacion.VolumenOcupadoCm3 / pos.CapacidadTotalVolumenCm3 : 0;
            const pctPeso = pos.CapacidadTotalPesoKg ? ocupacion.PesoOcupadoKg / pos.CapacidadTotalPesoKg : 0;

            if (
                (cfg.UmbralOcupacion && pctVol > cfg.UmbralOcupacion) ||
                (cfg.UmbralSobrepeso && pctPeso > cfg.UmbralSobrepeso) ||
                (cfg.UmbralFaltaStock && await this.faltaStock(pos.Id, cfg.IdEmpresa, cfg.UmbralFaltaStock))
            ) {
                await emailService.sendEmail({
                    idEmpresa: cfg.IdEmpresa,
                    destinatarios: cfg.ContactoDeposito || "alertas@example.com",
                    titulo: "Alerta de posición",
                    cuerpo: `La posición ${pos.Nombre} superó los límites configurados.`
                });
            }
        }
    }

    private async faltaStock(idPosicion: number, idEmpresa: number, umbral: number): Promise<boolean> {
        const row = await getRepository(PosicionMetrica)
            .createQueryBuilder("pm")
            .select("SUM(pm.unidades)", "u")
            .where("pm.posicionId = :idPosicion", { idPosicion })
            .andWhere("pm.empresaId = :idEmpresa", { idEmpresa })
            .getRawOne();
        const unidades = Number(row?.u || 0);
        return unidades < umbral;
    }
}

export const monitorService = new MonitorService();
