/**
 * Types pour le système de prompting avancé
 */

import { AIModel, AIProvider } from '../core/types';

/**
 * Modes d'accès aux modèles d'IA
 */
export enum AIAccessMode {
  API = 'api',                // Utilisation des API officielles (OpenAI, Anthropic)
  WEB_INTERFACE = 'web'       // Utilisation de l'interface web (ChatGPT Plus, Claude Web)
}

/**
 * Configuration pour le système de prompting
 */
export interface PromptingConfig {
  provider: AIProvider;
  model: AIModel;
  accessMode: AIAccessMode;
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
}

/**
 * Types de prompts dans le système
 */
export enum PromptType {
  ANALYSIS = 'analysis',      // Analyse et compréhension de la requête
  PLANNING = 'planning',      // Planification des tâches à exécuter
  EXECUTION = 'execution',    // Exécution des tâches planifiées
  SYNTHESIS = 'synthesis'     // Synthèse des résultats
}

/**
 * Interface pour un template de prompt
 */
export interface PromptTemplate {
  type: PromptType;
  template: string;
  variables: string[];
  description: string;
  provider?: AIProvider;      // Si spécifique à un fournisseur
  model?: AIModel;            // Si spécifique à un modèle
}

/**
 * Interface pour un prompt compilé prêt à être envoyé à l'IA
 */
export interface CompiledPrompt {
  type: PromptType;
  content: string;
  variables: Record<string, any>;
}

/**
 * Interface pour le résultat d'un prompt
 */
export interface PromptResult {
  type: PromptType;
  content: string;
  success: boolean;
  error?: string;
  metadata?: Record<string, any>;
}

/**
 * Interface pour les instructions de l'interface web
 */
export interface WebInterfaceInstructions {
  provider: AIProvider;
  setupSteps: string[];
  promptFormatting: string;
  responseExtraction: string;
}
