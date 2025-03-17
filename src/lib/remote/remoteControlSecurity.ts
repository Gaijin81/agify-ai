/**
 * Mesures de sécurité pour le contrôle à distance
 * 
 * Ce fichier implémente des mesures de sécurité pour protéger l'utilisateur
 * lors de l'utilisation des fonctionnalités de contrôle à distance.
 */

import { ControlAction } from '../remote/remoteControlService';

// Liste des applications autorisées
const ALLOWED_APPLICATIONS = [
  'code', // Visual Studio Code
  'chrome', 'firefox', 'edge', // Navigateurs
  'notepad', 'wordpad', // Éditeurs de texte
  'explorer', // Explorateur de fichiers
  'cmd', 'powershell', 'terminal', // Terminaux
];

// Dossiers sensibles à protéger
const SENSITIVE_DIRECTORIES = [
  '/etc/',
  '/var/',
  '/root/',
  'C:\\Windows\\System32',
  'C:\\Program Files',
  'C:\\Users\\*\\AppData',
];

// Actions nécessitant une confirmation
const ACTIONS_REQUIRING_CONFIRMATION = [
  ControlAction.OPEN_APPLICATION,
  ControlAction.CLOSE_APPLICATION,
  ControlAction.TEXT_INPUT,
];

export class RemoteControlSecurity {
  // Durée maximale d'une session de contrôle (en minutes)
  private static MAX_SESSION_DURATION = 30;
  
  // Journal des actions effectuées
  private static actionLog: Array<{
    timestamp: Date;
    action: ControlAction;
    parameters: Record<string, any>;
    allowed: boolean;
  }> = [];
  
  /**
   * Vérifie si une application est autorisée
   */
  static isApplicationAllowed(appName: string): boolean {
    return ALLOWED_APPLICATIONS.some(app => 
      appName.toLowerCase().includes(app.toLowerCase())
    );
  }
  
  /**
   * Vérifie si un chemin de fichier est sensible
   */
  static isPathSensitive(path: string): boolean {
    return SENSITIVE_DIRECTORIES.some(dir => {
      // Remplacer les caractères génériques par des expressions régulières
      const regexDir = dir.replace(/\*/g, '.*');
      return new RegExp(regexDir, 'i').test(path);
    });
  }
  
  /**
   * Vérifie si une action nécessite une confirmation
   */
  static doesActionRequireConfirmation(action: ControlAction): boolean {
    return ACTIONS_REQUIRING_CONFIRMATION.includes(action);
  }
  
  /**
   * Vérifie si une action est autorisée
   */
  static isActionAllowed(action: ControlAction, parameters: Record<string, any>): boolean {
    // Vérifier les actions spécifiques
    switch (action) {
      case ControlAction.OPEN_APPLICATION:
        if (!this.isApplicationAllowed(parameters.appName)) {
          return false;
        }
        break;
        
      case ControlAction.TEXT_INPUT:
        // Vérifier si le texte contient des commandes potentiellement dangereuses
        const dangerousPatterns = [
          /rm -rf/i, /deltree/i, /format/i, 
          /sudo/i, /chmod/i, /chown/i,
          /net user/i, /net localgroup/i
        ];
        
        if (dangerousPatterns.some(pattern => pattern.test(parameters.text))) {
          return false;
        }
        break;
    }
    
    // Enregistrer l'action dans le journal
    this.logAction(action, parameters, true);
    
    return true;
  }
  
  /**
   * Enregistre une action dans le journal
   */
  static logAction(action: ControlAction, parameters: Record<string, any>, allowed: boolean): void {
    this.actionLog.push({
      timestamp: new Date(),
      action,
      parameters,
      allowed
    });
    
    // Dans une implémentation réelle, on pourrait également enregistrer
    // ces actions dans une base de données ou un fichier de log
  }
  
  /**
   * Récupère le journal des actions
   */
  static getActionLog(): Array<{
    timestamp: Date;
    action: ControlAction;
    parameters: Record<string, any>;
    allowed: boolean;
  }> {
    return [...this.actionLog];
  }
  
  /**
   * Vérifie si la durée de session maximale est dépassée
   */
  static isSessionDurationExceeded(startTime: Date): boolean {
    const now = new Date();
    const durationInMinutes = (now.getTime() - startTime.getTime()) / (1000 * 60);
    return durationInMinutes > this.MAX_SESSION_DURATION;
  }
  
  /**
   * Génère un rapport de sécurité
   */
  static generateSecurityReport(): {
    totalActions: number;
    allowedActions: number;
    blockedActions: number;
    actionsByType: Record<string, number>;
  } {
    const report = {
      totalActions: this.actionLog.length,
      allowedActions: this.actionLog.filter(log => log.allowed).length,
      blockedActions: this.actionLog.filter(log => !log.allowed).length,
      actionsByType: {} as Record<string, number>
    };
    
    // Compter les actions par type
    this.actionLog.forEach(log => {
      if (!report.actionsByType[log.action]) {
        report.actionsByType[log.action] = 0;
      }
      report.actionsByType[log.action]++;
    });
    
    return report;
  }
  
  /**
   * Efface le journal des actions
   */
  static clearActionLog(): void {
    this.actionLog = [];
  }
}
