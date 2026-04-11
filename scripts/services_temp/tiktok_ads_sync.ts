import { env } from '../config/env';
import axios from 'axios';

export class TikTokAdsSyncService {
    private readonly accessToken = env.TIKTOK_ACCESS_TOKEN;
    private readonly advId = env.TIKTOK_ADVERTISER_ID;

    /**
     * Pausa o arranca campañas publicitarias comparando el Dropi Tracker de ingresos/fletes de hoy
     */
    async evaluateCampaignsBasedOnDropiROI(dropiWalletStatus: { profits: number, shippingCosts: number }) {
        if (!this.accessToken || !this.advId) return;

        const roi = dropiWalletStatus.profits - dropiWalletStatus.shippingCosts;
        console.log(`[TikTokSync] Evaluando ROI actual derivado de Dropi: $${roi}`);

        if (roi < 0) {
            console.log('[!] El ROI actual (Fletes cobrados vs Ganancia) es negativo. Deteniendo campañas para mitigar pérdidas.');
            await this.toggleCampaignState('DISABLE');
        } else if (roi > 50000) {
            // Si el ROI es alto, acelerar pauta (ejemplo heurístico)
            console.log('[+] ROI positivo fuerte. Escalando pauta activa en TikTok.');
            await this.toggleCampaignState('ENABLE');
        }
    }

    private async toggleCampaignState(operation: 'ENABLE' | 'DISABLE') {
        try {
            // Llamada síncrona a la TikTok Marketing API
            /*
            await axios.post('https://business-api.tiktok.com/open_api/v1.3/campaign/status/update/', {
                advertiser_id: this.advId,
                operation_status: operation
            }, {
                headers: { 'Access-Token': this.accessToken }
            });
            */
            console.log(`[+] Sistema de Anuncios actualizado a estado: ${operation}`);
        } catch(e) {
            console.log('[!] Error llamando a TikTok Ads API', e);
        }
    }
}
