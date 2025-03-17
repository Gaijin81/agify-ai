/**
 * Tests automatisés pour l'application AGI Wrapper
 * 
 * Ce fichier contient des tests automatisés pour vérifier le bon fonctionnement
 * des principales fonctionnalités de l'application.
 */

import { AIProvider, AIModel } from '../lib/core/types';
import { PromptManager } from '../lib/prompting/promptManager';
import { PromptType, AIAccessMode } from '../lib/prompting/types';
import { TaskManager } from '../lib/core/taskManager';
import { RequestInterpreter } from '../lib/core/requestInterpreter';
import { AutonomyEngine } from '../lib/autonomy/autonomyEngine';
import { RemoteControlService } from '../lib/remote/remoteControlService';
import { RemoteControlSecurity } from '../lib/remote/remoteControlSecurity';
import { AdminModeService } from '../lib/admin/adminModeService';
import { ManusAIProvider } from '../lib/ai/manusAIProvider';
import { BugReportService } from '../lib/debug/bugReportService';
import { CollectiveExperienceNetwork } from '../lib/collective/collectiveExperienceNetwork';

/**
 * Fonction principale de test
 */
async function runTests() {
  console.log('=== Démarrage des tests automatisés pour AGI Wrapper ===');
  
  let passedTests = 0;
  let failedTests = 0;
  
  // Tester le système de prompting avancé
  try {
    console.log('\n--- Test du système de prompting avancé ---');
    const promptManager = new PromptManager();
    
    // Tester la récupération de templates
    const analysisTemplate = promptManager.getTemplate(PromptType.ANALYSIS);
    console.log('Template d\'analyse récupéré:', !!analysisTemplate);
    
    // Tester la compilation de prompts
    const compiledPrompt = promptManager.compilePrompt(
      PromptType.ANALYSIS,
      { userRequest: 'Analyse cette base de données' },
      {
        provider: 'openai',
        model: { id: 'gpt-4', name: 'GPT-4', provider: 'openai', maxTokens: 8000 },
        accessMode: AIAccessMode.API
      }
    );
    console.log('Prompt compilé avec succès:', !!compiledPrompt);
    
    // Vérifier que le prompt contient la requête utilisateur
    const containsUserRequest = compiledPrompt?.content.includes('Analyse cette base de données') || false;
    console.log('Le prompt contient la requête utilisateur:', containsUserRequest);
    
    if (analysisTemplate && compiledPrompt && containsUserRequest) {
      console.log('✅ Test du système de prompting avancé réussi');
      passedTests++;
    } else {
      throw new Error('Échec du test du système de prompting avancé');
    }
  } catch (error) {
    console.error('❌ Échec du test du système de prompting avancé:', error);
    failedTests++;
  }
  
  // Tester l'intégration de Manus IA
  try {
    console.log('\n--- Test de l\'intégration de Manus IA ---');
    const manusProvider = new ManusAIProvider({ apiKey: 'test-key' });
    
    // Initialiser le fournisseur
    const initialized = await manusProvider.initialize();
    console.log('Manus IA initialisé:', initialized);
    
    // Vérifier que le fournisseur est prêt
    const isReady = manusProvider.isReady();
    console.log('Manus IA est prêt:', isReady);
    
    // Récupérer les modèles disponibles
    const models = await manusProvider.getAvailableModels();
    console.log('Modèles Manus IA disponibles:', models.length > 0);
    
    // Créer une conversation
    const conversation = manusProvider.createConversation(models[0]);
    console.log('Conversation Manus IA créée:', !!conversation);
    
    if (initialized && isReady && models.length > 0 && conversation) {
      console.log('✅ Test de l\'intégration de Manus IA réussi');
      passedTests++;
    } else {
      throw new Error('Échec du test de l\'intégration de Manus IA');
    }
  } catch (error) {
    console.error('❌ Échec du test de l\'intégration de Manus IA:', error);
    failedTests++;
  }
  
  // Tester le mode administrateur
  try {
    console.log('\n--- Test du mode administrateur ---');
    const adminService = new AdminModeService();
    
    // Vérifier les identifiants par défaut
    const validCredentials = adminService.verifyCredentials('admin', 'admin123');
    console.log('Identifiants par défaut valides:', validCredentials);
    
    // Créer une session administrateur
    const session = adminService.createAdminSession('admin');
    console.log('Session administrateur créée:', !!session);
    
    // Vérifier que la session est valide
    const isSessionValid = session ? adminService.isSessionValid(session.id) : false;
    console.log('Session administrateur valide:', isSessionValid);
    
    // Vérifier si une requête est autorisée en mode admin
    const isRequestAllowed = session ? adminService.isRequestAllowed('pentest vulnerability', session.id) : false;
    console.log('Requête sensible autorisée en mode admin:', isRequestAllowed);
    
    if (validCredentials && session && isSessionValid && isRequestAllowed) {
      console.log('✅ Test du mode administrateur réussi');
      passedTests++;
    } else {
      throw new Error('Échec du test du mode administrateur');
    }
  } catch (error) {
    console.error('❌ Échec du test du mode administrateur:', error);
    failedTests++;
  }
  
  // Tester le système de rapport de bugs
  try {
    console.log('\n--- Test du système de rapport de bugs ---');
    const bugReportService = new BugReportService();
    
    // Enregistrer une erreur
    bugReportService.logError('Test d\'erreur pour le rapport de bugs');
    
    // Créer un rapport de bug
    const report = await bugReportService.createBugReport('test@example.com', 'Description du bug de test');
    console.log('Rapport de bug créé:', !!report);
    
    // Récupérer le rapport
    const retrievedReport = bugReportService.getBugReport(report.id);
    console.log('Rapport de bug récupéré:', !!retrievedReport);
    
    // Vérifier que le rapport contient les informations attendues
    const hasExpectedInfo = retrievedReport?.userEmail === 'test@example.com' && 
                           retrievedReport?.userDescription === 'Description du bug de test';
    console.log('Le rapport contient les informations attendues:', hasExpectedInfo);
    
    if (report && retrievedReport && hasExpectedInfo) {
      console.log('✅ Test du système de rapport de bugs réussi');
      passedTests++;
    } else {
      throw new Error('Échec du test du système de rapport de bugs');
    }
  } catch (error) {
    console.error('❌ Échec du test du système de rapport de bugs:', error);
    failedTests++;
  }
  
  // Tester le Réseau Neuronal d'Expérience Collective
  try {
    console.log('\n--- Test du Réseau Neuronal d\'Expérience Collective ---');
    const network = new CollectiveExperienceNetwork();
    
    // Ajouter une expérience
    const node = network.addExperience(
      'Comment optimiser les performances d\'une application React?',
      'Pour optimiser les performances d\'une application React, vous pouvez utiliser React.memo, useCallback, et useMemo pour éviter les rendus inutiles.',
      85,
      {
        provider: 'manus',
        model: 'manus-default',
        tags: ['react', 'performance', 'optimisation']
      }
    );
    console.log('Nœud d\'expérience créé:', !!node);
    
    // Trouver un nœud similaire
    const similarNode = network.findSimilarNode('Comment améliorer les performances de mon app React?');
    console.log('Nœud similaire trouvé:', !!similarNode);
    
    // Améliorer un prompt
    const enhancedPrompt = network.enhancePrompt('Comment optimiser React?', 'user-test');
    console.log('Prompt amélioré:', enhancedPrompt !== 'Comment optimiser React?');
    
    // Générer un rapport sur l'état du réseau
    const report = network.generateNetworkReport();
    console.log('Rapport du réseau généré:', report.nodeCount > 0);
    
    if (node && similarNode && enhancedPrompt !== 'Comment optimiser React?' && report.nodeCount > 0) {
      console.log('✅ Test du Réseau Neuronal d\'Expérience Collective réussi');
      passedTests++;
    } else {
      throw new Error('Échec du test du Réseau Neuronal d\'Expérience Collective');
    }
  } catch (error) {
    console.error('❌ Échec du test du Réseau Neuronal d\'Expérience Collective:', error);
    failedTests++;
  }
  
  // Tester le contrôle à distance
  try {
    console.log('\n--- Test du contrôle à distance ---');
    const remoteControlService = new RemoteControlService();
    
    // Démarrer une session de partage d'écran
    const session = remoteControlService.startScreenShareSession();
    console.log('Session de partage d\'écran démarrée:', !!session);
    
    // Vérifier que la session est active
    const isActive = remoteControlService.isScreenShareActive();
    console.log('Session de partage d\'écran active:', isActive);
    
    // Demander la permission de contrôle
    const permissionGranted = remoteControlService.requestControlPermission();
    console.log('Permission de contrôle accordée:', permissionGranted);
    
    // Vérifier que la permission est accordée
    const hasPermission = remoteControlService.hasControlPermission();
    console.log('A la permission de contrôle:', hasPermission);
    
    if (session && isActive && permissionGranted && hasPermission) {
      console.log('✅ Test du contrôle à distance réussi');
      passedTests++;
    } else {
      throw new Error('Échec du test du contrôle à distance');
    }
  } catch (error) {
    console.error('❌ Échec du test du contrôle à distance:', error);
    failedTests++;
  }
  
  // Résumé des tests
  console.log('\n=== Résumé des tests ===');
  console.log(`Tests réussis: ${passedTests}`);
  console.log(`Tests échoués: ${failedTests}`);
  console.log(`Taux de réussite: ${Math.round((passedTests / (passedTests + failedTests)) * 100)}%`);
  
  return {
    passedTests,
    failedTests,
    totalTests: passedTests + failedTests
  };
}

// Exécuter les tests
runTests().then(results => {
  console.log('Tests terminés avec les résultats suivants:', results);
}).catch(error => {
  console.error('Erreur lors de l\'exécution des tests:', error);
});
