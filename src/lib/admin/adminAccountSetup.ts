/**
 * Intégration du compte administrateur pour Stephane GAGNANT
 * avec validation par email et mot de passe temporaire
 */

import { AdminModeService } from '../admin/adminModeService';
import * as crypto from 'crypto';
import nodemailer from 'nodemailer';

export class AdminAccountSetup {
  private adminService: AdminModeService;
  private temporaryPassword: string;
  private resetTokens: Map<string, { token: string, expiry: Date, email: string }> = new Map();
  
  constructor(adminService: AdminModeService) {
    this.adminService = adminService;
    this.temporaryPassword = this.generateSecurePassword();
    this.setupStephaneGagnantAccount();
  }
  
  /**
   * Génère un mot de passe sécurisé aléatoire
   */
  private generateSecurePassword(length: number = 16): string {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=';
    let password = '';
    
    // Assurer au moins un caractère de chaque catégorie
    password += charset.substring(0, 26).charAt(Math.floor(Math.random() * 26)); // minuscule
    password += charset.substring(26, 52).charAt(Math.floor(Math.random() * 26)); // majuscule
    password += charset.substring(52, 62).charAt(Math.floor(Math.random() * 10)); // chiffre
    password += charset.substring(62).charAt(Math.floor(Math.random() * (charset.length - 62))); // spécial
    
    // Compléter avec des caractères aléatoires
    for (let i = 4; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    
    // Mélanger le mot de passe
    return password.split('').sort(() => 0.5 - Math.random()).join('');
  }
  
  /**
   * Configure le compte administrateur pour Stephane GAGNANT
   */
  private setupStephaneGagnantAccount(): void {
    // Dans une implémentation réelle, cela utiliserait adminService.addAdmin()
    console.log(`Compte administrateur configuré pour Stephane GAGNANT avec mot de passe temporaire: ${this.temporaryPassword}`);
    
    // Simuler l'envoi d'un email
    this.sendPasswordEmail('stephane.gagnant@sncf.fr', this.temporaryPassword);
  }
  
  /**
   * Envoie un email avec le mot de passe temporaire
   */
  private sendPasswordEmail(email: string, password: string): void {
    // Dans une implémentation réelle, cela utiliserait nodemailer pour envoyer un email
    console.log(`Email envoyé à ${email} avec le mot de passe temporaire: ${password}`);
    
    // Exemple de code pour envoyer un email (non fonctionnel dans cet environnement)
    /*
    const transporter = nodemailer.createTransport({
      host: 'smtp.example.com',
      port: 587,
      secure: false,
      auth: {
        user: 'noreply@example.com',
        pass: 'password'
      }
    });
    
    const mailOptions = {
      from: 'AGI Wrapper <noreply@example.com>',
      to: email,
      subject: 'Votre compte administrateur AGI Wrapper',
      text: `Bonjour Stephane GAGNANT,\n\nVotre compte administrateur a été créé pour l'application AGI Wrapper.\n\nVotre mot de passe temporaire est: ${password}\n\nVous devrez changer ce mot de passe lors de votre première connexion.\n\nCordialement,\nL'équipe AGI Wrapper`,
      html: `<p>Bonjour Stephane GAGNANT,</p><p>Votre compte administrateur a été créé pour l'application AGI Wrapper.</p><p>Votre mot de passe temporaire est: <strong>${password}</strong></p><p>Vous devrez changer ce mot de passe lors de votre première connexion.</p><p>Cordialement,<br>L'équipe AGI Wrapper</p>`
    };
    
    transporter.sendMail(mailOptions);
    */
  }
  
  /**
   * Génère un token de réinitialisation de mot de passe
   */
  generatePasswordResetToken(email: string): string {
    const token = crypto.randomBytes(32).toString('hex');
    const expiry = new Date();
    expiry.setHours(expiry.getHours() + 24); // Valide pendant 24 heures
    
    this.resetTokens.set(email, { token, expiry, email });
    return token;
  }
  
  /**
   * Vérifie un token de réinitialisation de mot de passe
   */
  verifyPasswordResetToken(email: string, token: string): boolean {
    const resetInfo = this.resetTokens.get(email);
    if (!resetInfo) return false;
    
    const now = new Date();
    if (now > resetInfo.expiry) {
      this.resetTokens.delete(email);
      return false;
    }
    
    return resetInfo.token === token;
  }
  
  /**
   * Change le mot de passe d'un utilisateur
   */
  changePassword(email: string, token: string, newPassword: string): boolean {
    if (!this.verifyPasswordResetToken(email, token)) {
      return false;
    }
    
    // Dans une implémentation réelle, cela changerait le mot de passe dans adminService
    console.log(`Mot de passe changé pour ${email}`);
    
    this.resetTokens.delete(email);
    return true;
  }
  
  /**
   * Récupère le mot de passe temporaire (uniquement à des fins de démonstration)
   */
  getTemporaryPassword(): string {
    return this.temporaryPassword;
  }
}
