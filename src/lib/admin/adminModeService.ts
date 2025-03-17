/**
 * AdminMode - Gestion du mode administrateur
 * 
 * Ce service permet de gérer le mode administrateur qui désactive
 * les restrictions sur certains types de requêtes et étend les
 * capacités de l'application.
 */

import { v4 as uuidv4 } from 'uuid';
import * as crypto from 'crypto';

export interface AdminCredentials {
  username: string;
  passwordHash: string;
  salt: string;
}

export interface AdminSession {
  id: string;
  username: string;
  startTime: Date;
  expiryTime: Date;
  active: boolean;
}

export class AdminModeService {
  private static readonly SESSION_DURATION_HOURS = 2; // Durée de session en heures
  
  private credentials: AdminCredentials[] = [];
  private sessions: Map<string, AdminSession> = new Map();
  private isInitialized: boolean = false;
  
  constructor() {
    // Initialiser avec un compte admin par défaut (à des fins de démonstration uniquement)
    this.initialize();
  }
  
  /**
   * Initialise le service avec un compte admin par défaut
   */
  private initialize(): void {
    if (this.isInitialized) return;
    
    const defaultSalt = crypto.randomBytes(16).toString('hex');
    const defaultPasswordHash = this.hashPassword('admin123', defaultSalt);
    
    this.credentials.push({
      username: 'admin',
      passwordHash: defaultPasswordHash,
      salt: defaultSalt
    });
    
    this.isInitialized = true;
  }
  
  /**
   * Hache un mot de passe avec un sel
   */
  private hashPassword(password: string, salt: string): string {
    return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  }
  
  /**
   * Vérifie les identifiants d'un administrateur
   */
  verifyCredentials(username: string, password: string): boolean {
    const admin = this.credentials.find(cred => cred.username === username);
    if (!admin) return false;
    
    const hashedPassword = this.hashPassword(password, admin.salt);
    return hashedPassword === admin.passwordHash;
  }
  
  /**
   * Crée une session administrateur
   */
  createAdminSession(username: string): AdminSession | null {
    const admin = this.credentials.find(cred => cred.username === username);
    if (!admin) return null;
    
    const now = new Date();
    const expiryTime = new Date(now);
    expiryTime.setHours(now.getHours() + AdminModeService.SESSION_DURATION_HOURS);
    
    const session: AdminSession = {
      id: uuidv4(),
      username,
      startTime: now,
      expiryTime,
      active: true
    };
    
    this.sessions.set(session.id, session);
    return session;
  }
  
  /**
   * Vérifie si une session est valide
   */
  isSessionValid(sessionId: string): boolean {
    const session = this.sessions.get(sessionId);
    if (!session) return false;
    
    const now = new Date();
    if (now > session.expiryTime || !session.active) {
      return false;
    }
    
    return true;
  }
  
  /**
   * Termine une session administrateur
   */
  endAdminSession(sessionId: string): boolean {
    const session = this.sessions.get(sessionId);
    if (!session) return false;
    
    session.active = false;
    this.sessions.set(sessionId, session);
    return true;
  }
  
  /**
   * Ajoute un nouvel administrateur
   */
  addAdmin(username: string, password: string, currentAdminSessionId: string): boolean {
    // Vérifier que la session courante est valide
    if (!this.isSessionValid(currentAdminSessionId)) {
      return false;
    }
    
    // Vérifier que l'utilisateur n'existe pas déjà
    if (this.credentials.some(cred => cred.username === username)) {
      return false;
    }
    
    const salt = crypto.randomBytes(16).toString('hex');
    const passwordHash = this.hashPassword(password, salt);
    
    this.credentials.push({
      username,
      passwordHash,
      salt
    });
    
    return true;
  }
  
  /**
   * Supprime un administrateur
   */
  removeAdmin(username: string, currentAdminSessionId: string): boolean {
    // Vérifier que la session courante est valide
    if (!this.isSessionValid(currentAdminSessionId)) {
      return false;
    }
    
    // Empêcher la suppression du dernier administrateur
    if (this.credentials.length <= 1) {
      return false;
    }
    
    const initialLength = this.credentials.length;
    this.credentials = this.credentials.filter(cred => cred.username !== username);
    
    // Terminer toutes les sessions de cet administrateur
    for (const [sessionId, session] of this.sessions.entries()) {
      if (session.username === username) {
        session.active = false;
        this.sessions.set(sessionId, session);
      }
    }
    
    return this.credentials.length < initialLength;
  }
  
  /**
   * Vérifie si le mode administrateur est activé pour une requête
   */
  isAdminModeEnabled(sessionId: string | null): boolean {
    if (!sessionId) return false;
    return this.isSessionValid(sessionId);
  }
  
  /**
   * Récupère la liste des fonctionnalités disponibles en mode administrateur
   */
  getAdminFeatures(): string[] {
    return [
      "Désactivation des filtres de sécurité sur les requêtes",
      "Accès aux applications normalement restreintes",
      "Exécution de commandes avancées via le contrôle à distance",
      "Support pour les requêtes liées au pentest et à la sécurité",
      "Accès à des modèles d'IA plus avancés",
      "Personnalisation avancée des prompts système",
      "Journalisation détaillée des actions"
    ];
  }
  
  /**
   * Vérifie si une requête spécifique est autorisée en mode administrateur
   */
  isRequestAllowed(request: string, sessionId: string | null): boolean {
    // Si le mode admin n'est pas activé, appliquer les restrictions standard
    if (!this.isAdminModeEnabled(sessionId)) {
      // Vérifier si la requête contient des mots-clés sensibles
      const sensitiveKeywords = [
        'pentest', 'hacking', 'exploit', 'vulnerability', 'crack',
        'password', 'breach', 'attack', 'malware', 'ransomware'
      ];
      
      return !sensitiveKeywords.some(keyword => 
        request.toLowerCase().includes(keyword.toLowerCase())
      );
    }
    
    // En mode admin, toutes les requêtes sont autorisées
    return true;
  }
}
