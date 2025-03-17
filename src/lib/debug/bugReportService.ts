/**
 * BugReportService - Service de rapport de bugs
 * 
 * Ce service permet de collecter automatiquement les informations pertinentes
 * en cas de problème et de les envoyer directement à Manus IA ou à d'autres
 * assistants pour analyse et résolution rapide.
 */

import { v4 as uuidv4 } from 'uuid';
import { AIProvider } from '../core/types';
import { ManusAIProvider } from '../ai/manusAIProvider';

export interface BugReport {
  id: string;
  timestamp: Date;
  userEmail?: string;
  userDescription?: string;
  appState: Record<string, any>;
  errorLogs: string[];
  screenshot?: string;
  browserInfo: {
    userAgent: string;
    platform: string;
    language: string;
    screenSize: { width: number; height: number };
  };
  status: 'pending' | 'analyzing' | 'resolved';
  resolution?: string;
}

export class BugReportService {
  private reports: Map<string, BugReport> = new Map();
  private maxLogEntries: number = 100;
  private errorLogs: string[] = [];
  private manusProvider: ManusAIProvider | null = null;
  
  constructor() {
    // Initialiser le service
    this.setupErrorListener();
    this.initializeManusProvider();
  }
  
  /**
   * Initialise le fournisseur Manus IA
   */
  private async initializeManusProvider(): Promise<void> {
    try {
      this.manusProvider = new ManusAIProvider({ apiKey: 'manus-internal' });
      await this.manusProvider.initialize();
    } catch (error) {
      console.error('Erreur lors de l\'initialisation de Manus IA pour les rapports de bugs:', error);
    }
  }
  
  /**
   * Configure un écouteur d'erreurs global
   */
  private setupErrorListener(): void {
    if (typeof window !== 'undefined') {
      window.addEventListener('error', (event) => {
        this.logError(`Erreur non gérée: ${event.message} à ${event.filename}:${event.lineno}:${event.colno}`);
      });
      
      window.addEventListener('unhandledrejection', (event) => {
        this.logError(`Promesse rejetée non gérée: ${event.reason}`);
      });
    }
  }
  
  /**
   * Enregistre une erreur dans les logs
   */
  logError(message: string): void {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${message}`;
    
    this.errorLogs.push(logEntry);
    
    // Limiter la taille des logs
    if (this.errorLogs.length > this.maxLogEntries) {
      this.errorLogs.shift();
    }
    
    // Dans une implémentation réelle, on pourrait également envoyer
    // les erreurs critiques à un service de monitoring
  }
  
  /**
   * Capture l'état actuel de l'application
   */
  private captureAppState(): Record<string, any> {
    // Dans une implémentation réelle, cela capturerait l'état de Redux/Context
    // et d'autres informations pertinentes sur l'état de l'application
    
    return {
      currentRoute: typeof window !== 'undefined' ? window.location.pathname : 'unknown',
      timestamp: new Date().toISOString(),
      localStorage: this.safelyGetLocalStorage(),
      sessionData: this.safelyGetSessionData()
    };
  }
  
  /**
   * Récupère en toute sécurité les données de localStorage
   */
  private safelyGetLocalStorage(): Record<string, any> {
    if (typeof window === 'undefined' || !window.localStorage) {
      return {};
    }
    
    try {
      const result: Record<string, any> = {};
      
      // Ne pas inclure les informations sensibles
      const sensitiveKeys = ['apiKey', 'password', 'token', 'secret'];
      
      for (let i = 0; i < window.localStorage.length; i++) {
        const key = window.localStorage.key(i);
        if (key) {
          // Vérifier si la clé contient des informations sensibles
          if (!sensitiveKeys.some(sk => key.toLowerCase().includes(sk.toLowerCase()))) {
            result[key] = window.localStorage.getItem(key);
          } else {
            result[key] = '[REDACTED]';
          }
        }
      }
      
      return result;
    } catch (error) {
      return { error: 'Impossible d\'accéder à localStorage' };
    }
  }
  
  /**
   * Récupère en toute sécurité les données de session
   */
  private safelyGetSessionData(): Record<string, any> {
    if (typeof window === 'undefined' || !window.sessionStorage) {
      return {};
    }
    
    try {
      const result: Record<string, any> = {};
      
      // Ne pas inclure les informations sensibles
      const sensitiveKeys = ['apiKey', 'password', 'token', 'secret'];
      
      for (let i = 0; i < window.sessionStorage.length; i++) {
        const key = window.sessionStorage.key(i);
        if (key) {
          // Vérifier si la clé contient des informations sensibles
          if (!sensitiveKeys.some(sk => key.toLowerCase().includes(sk.toLowerCase()))) {
            result[key] = window.sessionStorage.getItem(key);
          } else {
            result[key] = '[REDACTED]';
          }
        }
      }
      
      return result;
    } catch (error) {
      return { error: 'Impossible d\'accéder à sessionStorage' };
    }
  }
  
  /**
   * Capture une capture d'écran
   */
  private async captureScreenshot(): Promise<string | undefined> {
    // Dans une implémentation réelle, cela utiliserait html2canvas ou une autre
    // bibliothèque pour capturer une image de l'écran
    
    // Pour l'instant, retourner une image vide
    return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
  }
  
  /**
   * Récupère les informations sur le navigateur
   */
  private getBrowserInfo(): {
    userAgent: string;
    platform: string;
    language: string;
    screenSize: { width: number; height: number };
  } {
    if (typeof window === 'undefined' || !window.navigator) {
      return {
        userAgent: 'unknown',
        platform: 'unknown',
        language: 'unknown',
        screenSize: { width: 0, height: 0 }
      };
    }
    
    return {
      userAgent: window.navigator.userAgent,
      platform: window.navigator.platform,
      language: window.navigator.language,
      screenSize: {
        width: window.screen.width,
        height: window.screen.height
      }
    };
  }
  
  /**
   * Crée un rapport de bug
   */
  async createBugReport(userEmail?: string, userDescription?: string): Promise<BugReport> {
    const report: BugReport = {
      id: uuidv4(),
      timestamp: new Date(),
      userEmail,
      userDescription,
      appState: this.captureAppState(),
      errorLogs: [...this.errorLogs],
      screenshot: await this.captureScreenshot(),
      browserInfo: this.getBrowserInfo(),
      status: 'pending'
    };
    
    this.reports.set(report.id, report);
    
    // Envoyer le rapport à Manus IA pour analyse
    this.analyzeWithManusIA(report);
    
    return report;
  }
  
  /**
   * Récupère un rapport de bug par son ID
   */
  getBugReport(id: string): BugReport | undefined {
    return this.reports.get(id);
  }
  
  /**
   * Récupère tous les rapports de bug
   */
  getAllBugReports(): BugReport[] {
    return Array.from(this.reports.values());
  }
  
  /**
   * Analyse un rapport de bug avec Manus IA
   */
  private async analyzeWithManusIA(report: BugReport): Promise<void> {
    if (!this.manusProvider || !this.manusProvider.isReady()) {
      console.error('Manus IA n\'est pas disponible pour analyser le rapport de bug');
      return;
    }
    
    try {
      // Mettre à jour le statut du rapport
      report.status = 'analyzing';
      this.reports.set(report.id, report);
      
      // Créer une conversation avec Manus IA
      const models = await this.manusProvider.getAvailableModels();
      const conversation = this.manusProvider.createConversation(models[0]);
      
      // Préparer le message pour Manus IA
      const message = {
        role: 'user',
        content: `
# Analyse de Rapport de Bug

## ID du Rapport
${report.id}

## Description Utilisateur
${report.userDescription || 'Aucune description fournie'}

## Logs d'Erreur
\`\`\`
${report.errorLogs.join('\n')}
\`\`\`

## État de l'Application
\`\`\`json
${JSON.stringify(report.appState, null, 2)}
\`\`\`

## Informations Navigateur
\`\`\`json
${JSON.stringify(report.browserInfo, null, 2)}
\`\`\`

Merci d'analyser ce rapport de bug et de fournir:
1. Une identification du problème potentiel
2. Des suggestions pour résoudre le problème
3. Des étapes pour reproduire et vérifier la correction
        `
      };
      
      // Envoyer le message à Manus IA
      const updatedConversation = await this.manusProvider.continueConversation(conversation, message);
      
      // Récupérer la réponse de Manus IA
      const response = updatedConversation.messages[updatedConversation.messages.length - 1];
      
      // Mettre à jour le rapport avec la résolution
      report.status = 'resolved';
      report.resolution = response.content;
      this.reports.set(report.id, report);
    } catch (error) {
      console.error('Erreur lors de l\'analyse du rapport de bug avec Manus IA:', error);
      
      // Mettre à jour le rapport avec l'erreur
      report.status = 'pending';
      report.resolution = `Erreur lors de l'analyse: ${error instanceof Error ? error.message : String(error)}`;
      this.reports.set(report.id, report);
    }
  }
  
  /**
   * Efface les logs d'erreur
   */
  clearErrorLogs(): void {
    this.errorLogs = [];
  }
}
