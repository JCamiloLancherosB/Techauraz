import { env } from '../config/env';

/**
 * Servicio de recuperación de carritos por WhatsApp usando neuromarketing.
 * Integra OpenAI (Roax Copilot) para generar copies convincentes.
 */
export class CartRecoveryService {
    private readonly openAiKey = env.OPENAI_API_KEY;
    private readonly copilotEnabled = env.ROAX_COPILOT_ENABLED;

    async processAbandonedCarts(carts: any[]) {
        if (!this.copilotEnabled) {
            console.log('[RecoveryCart] Roax Copilot está inactivo en el entorno.');
            return;
        }

        console.log(`[RecoveryCart] Iniciando procesamiento de ${carts.length} carritos abandonados...`);

        for (const cart of carts) {
            const urgencyCopy = await this.generateNeuromarketingCopy(cart);
            await this.enqueueWhatsAppMessage(cart.phone, urgencyCopy);
            console.log(`[+] Puesto en cola mensaje para ${cart.phone} sobre el producto ${cart.productName}`);
        }
    }

    private async generateNeuromarketingCopy(cart: any): Promise<string> {
        // En vez de un string estático, aquí conectamos con OpenAI pasando el cart.productName
        // Simulación del retorno de la IA entrenada con neuromarketing
        const promptTemplate = `Actúa como asesor experto. El cliente dejó ${cart.productName} en el carrito.
Genera escasez (solo quedan 2) y un call to action amigable.`;
        
        return `¡Hola ${cart.userName || ''}! Notamos que dejaste tu ${cart.productName} esperando. Te guardamos 1 de las últimas 2 unidades disponibles en bodega por las próximas 2 horas. ¿Deseas que terminemos el pedido por aquí directamente?`;
    }

    private async enqueueWhatsAppMessage(phone: string, text: string) {
        // Lógica para comunicarse con baileys
    }
}
