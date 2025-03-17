/**
 * Mise à jour du AIProviderFactory pour intégrer Manus IA
 */

import { AIProvider, AIModel } from '../core/types';
import { OpenAIProvider } from './openAIProvider';
import { AnthropicProvider } from './anthropicProvider';
import { ManusAIProvider } from './manusAIProvider';

export class AIProviderFactory {
  /**
   * Crée et initialise un fournisseur d'IA en fonction du type spécifié
   */
  static async createAndInitializeProvider(
    providerType: string,
    config: { apiKey: string }
  ): Promise<AIProvider> {
    let provider: AIProvider;
    
    switch (providerType.toLowerCase()) {
      case 'openai':
        provider = new OpenAIProvider(config);
        break;
      case 'anthropic':
        provider = new AnthropicProvider(config);
        break;
      case 'manus':
        provider = new ManusAIProvider(config);
        break;
      default:
        throw new Error(`Fournisseur d'IA non pris en charge: ${providerType}`);
    }
    
    const initialized = await provider.initialize();
    if (!initialized) {
      throw new Error(`Échec de l'initialisation du fournisseur ${providerType}`);
    }
    
    return provider;
  }
  
  /**
   * Récupère la liste des fournisseurs d'IA disponibles
   */
  static getAvailableProviders(): Array<{
    id: string;
    name: string;
    description: string;
    requiresApiKey: boolean;
  }> {
    return [
      {
        id: 'openai',
        name: 'OpenAI',
        description: 'Fournisseur des modèles GPT (ChatGPT)',
        requiresApiKey: true
      },
      {
        id: 'anthropic',
        name: 'Anthropic',
        description: 'Fournisseur des modèles Claude',
        requiresApiKey: true
      },
      {
        id: 'manus',
        name: 'Manus IA',
        description: 'Assistant IA avancé avec capacités étendues',
        requiresApiKey: false
      }
    ];
  }
}
