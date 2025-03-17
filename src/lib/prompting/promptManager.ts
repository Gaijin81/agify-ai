/**
 * PromptManager - Gère les templates de prompts et leur compilation
 * 
 * Ce service est responsable de la gestion des templates de prompts,
 * de leur compilation avec les variables appropriées et de leur envoi
 * aux fournisseurs d'IA.
 */

import { AIProvider, AIModel } from '../core/types';
import { 
  PromptType, 
  PromptTemplate, 
  CompiledPrompt, 
  PromptResult, 
  PromptingConfig,
  AIAccessMode,
  WebInterfaceInstructions
} from './types';

export class PromptManager {
  private templates: Map<string, PromptTemplate> = new Map();
  private webInstructions: Map<AIProvider, WebInterfaceInstructions> = new Map();
  
  constructor() {
    this.initializeDefaultTemplates();
    this.initializeWebInstructions();
  }
  
  /**
   * Initialise les templates de prompts par défaut
   */
  private initializeDefaultTemplates(): void {
    // Template pour l'analyse de la requête
    this.registerTemplate({
      type: PromptType.ANALYSIS,
      template: `
# Analyse de Requête Utilisateur

## Contexte
Tu es un système d'intelligence artificielle avancé conçu pour analyser des requêtes utilisateur et les décomposer en tâches exécutables. Tu dois comprendre l'intention de l'utilisateur et identifier les étapes nécessaires pour répondre à sa demande.

## Requête Utilisateur
"{{userRequest}}"

## Instructions
1. Analyse la requête ci-dessus en profondeur
2. Identifie l'objectif principal de la requête
3. Détermine les domaines de connaissances nécessaires
4. Identifie les contraintes explicites et implicites
5. Évalue la complexité de la requête (simple, moyenne, complexe)

## Format de Réponse
Réponds au format JSON structuré comme suit:
\`\`\`json
{
  "mainObjective": "Objectif principal de la requête",
  "knowledgeDomains": ["domaine1", "domaine2", ...],
  "constraints": ["contrainte1", "contrainte2", ...],
  "complexity": "simple|moyenne|complexe",
  "clarificationNeeded": boolean,
  "clarificationQuestions": ["question1", "question2", ...] // Si clarificationNeeded est true
}
\`\`\`
      `,
      variables: ['userRequest'],
      description: 'Analyse une requête utilisateur pour comprendre son intention et sa complexité'
    });
    
    // Template pour la planification des tâches
    this.registerTemplate({
      type: PromptType.PLANNING,
      template: `
# Planification de Tâches Autonomes

## Contexte
Tu es un système d'intelligence artificielle avancé conçu pour planifier l'exécution de tâches autonomes. Tu dois décomposer un objectif complexe en étapes exécutables et définir leur ordre d'exécution.

## Analyse de la Requête
{{analysisResult}}

## Instructions
1. Décompose l'objectif principal en tâches exécutables
2. Organise ces tâches dans un ordre logique d'exécution
3. Identifie les dépendances entre les tâches
4. Estime le temps nécessaire pour chaque tâche
5. Détermine les outils ou ressources nécessaires pour chaque tâche

## Format de Réponse
Réponds au format JSON structuré comme suit:
\`\`\`json
{
  "tasks": [
    {
      "id": "task-1",
      "description": "Description de la tâche",
      "dependencies": [], // IDs des tâches dont celle-ci dépend
      "estimatedTime": "estimation en minutes",
      "tools": ["outil1", "outil2", ...],
      "expectedOutput": "Description du résultat attendu"
    },
    // Autres tâches...
  ]
}
\`\`\`
      `,
      variables: ['analysisResult'],
      description: 'Planifie les tâches nécessaires pour répondre à une requête analysée'
    });
    
    // Template pour l'exécution des tâches
    this.registerTemplate({
      type: PromptType.EXECUTION,
      template: `
# Exécution de Tâche Autonome

## Contexte
Tu es un système d'intelligence artificielle avancé conçu pour exécuter des tâches de manière autonome. Tu dois accomplir la tâche spécifiée en utilisant les outils à ta disposition et en suivant les instructions fournies.

## Tâche à Exécuter
{{taskDescription}}

## Outils Disponibles
{{availableTools}}

## Contexte de la Requête
{{requestContext}}

## Instructions
1. Exécute la tâche spécifiée en utilisant les outils disponibles
2. Documente chaque étape de ton processus
3. Si tu rencontres des obstacles, essaie de les surmonter ou explique pourquoi c'est impossible
4. Produis un résultat conforme aux attentes

## Format de Réponse
Réponds au format JSON structuré comme suit:
\`\`\`json
{
  "taskId": "{{taskId}}",
  "steps": [
    {
      "stepNumber": 1,
      "description": "Description de l'étape",
      "toolUsed": "outil utilisé ou null",
      "result": "Résultat de l'étape"
    },
    // Autres étapes...
  ],
  "outcome": "succès|échec|partiel",
  "result": "Résultat final de la tâche",
  "issues": ["problème1", "problème2", ...] // Si des problèmes ont été rencontrés
}
\`\`\`
      `,
      variables: ['taskId', 'taskDescription', 'availableTools', 'requestContext'],
      description: 'Exécute une tâche spécifique de manière autonome'
    });
    
    // Template pour la synthèse des résultats
    this.registerTemplate({
      type: PromptType.SYNTHESIS,
      template: `
# Synthèse des Résultats

## Contexte
Tu es un système d'intelligence artificielle avancé conçu pour synthétiser les résultats de plusieurs tâches exécutées et produire une réponse cohérente à la requête initiale de l'utilisateur.

## Requête Initiale
{{userRequest}}

## Résultats des Tâches
{{taskResults}}

## Instructions
1. Analyse les résultats de toutes les tâches exécutées
2. Synthétise ces résultats en une réponse cohérente
3. Assure-toi que la réponse répond bien à la requête initiale
4. Vérifie la qualité et l'exactitude des informations
5. Présente les résultats de manière claire et structurée

## Format de Réponse
Réponds avec une synthèse complète et bien structurée qui répond directement à la requête de l'utilisateur. Inclus:
- Un résumé des actions effectuées
- Les résultats principaux
- Des recommandations si approprié
- Des limitations ou mises en garde si nécessaire
      `,
      variables: ['userRequest', 'taskResults'],
      description: 'Synthétise les résultats de plusieurs tâches en une réponse cohérente'
    });
  }
  
  /**
   * Initialise les instructions pour l'utilisation des interfaces web
   */
  private initializeWebInstructions(): void {
    // Instructions pour ChatGPT Plus
    this.webInstructions.set(AIProvider.OPENAI, {
      provider: AIProvider.OPENAI,
      setupSteps: [
        "1. Connectez-vous à votre compte ChatGPT Plus sur https://chat.openai.com/",
        "2. Créez une nouvelle conversation",
        "3. Assurez-vous d'utiliser le modèle GPT-4 (ou le modèle de votre choix)",
        "4. Copiez-collez le prompt formaté dans la zone de saisie"
      ],
      promptFormatting: "Copiez le prompt tel quel, sans modifications. Les variables entre {{}} auront déjà été remplacées.",
      responseExtraction: "Copiez la réponse complète de ChatGPT, y compris le JSON si présent."
    });
    
    // Instructions pour Claude Web
    this.webInstructions.set(AIProvider.ANTHROPIC, {
      provider: AIProvider.ANTHROPIC,
      setupSteps: [
        "1. Connectez-vous à votre compte Claude sur https://claude.ai/",
        "2. Créez une nouvelle conversation",
        "3. Assurez-vous d'utiliser le modèle Claude 3 approprié",
        "4. Copiez-collez le prompt formaté dans la zone de saisie"
      ],
      promptFormatting: "Copiez le prompt tel quel, sans modifications. Les variables entre {{}} auront déjà été remplacées.",
      responseExtraction: "Copiez la réponse complète de Claude, y compris le JSON si présent."
    });
  }
  
  /**
   * Enregistre un nouveau template de prompt
   */
  registerTemplate(template: PromptTemplate): void {
    const key = this.getTemplateKey(template.type, template.provider, template.model);
    this.templates.set(key, template);
  }
  
  /**
   * Récupère un template de prompt
   */
  getTemplate(type: PromptType, provider?: AIProvider, model?: AIModel): PromptTemplate | null {
    // Essayer de trouver un template spécifique au modèle
    if (provider && model) {
      const specificKey = this.getTemplateKey(type, provider, model);
      const specificTemplate = this.templates.get(specificKey);
      if (specificTemplate) return specificTemplate;
    }
    
    // Essayer de trouver un template spécifique au fournisseur
    if (provider) {
      const providerKey = this.getTemplateKey(type, provider);
      const providerTemplate = this.templates.get(providerKey);
      if (providerTemplate) return providerTemplate;
    }
    
    // Utiliser le template par défaut
    const defaultKey = this.getTemplateKey(type);
    return this.templates.get(defaultKey) || null;
  }
  
  /**
   * Génère une clé unique pour un template
   */
  private getTemplateKey(type: PromptType, provider?: AIProvider, model?: AIModel): string {
    let key = `${type}`;
    if (provider) key += `_${provider}`;
    if (model) key += `_${model}`;
    return key;
  }
  
  /**
   * Compile un template avec les variables fournies
   */
  compilePrompt(type: PromptType, variables: Record<string, any>, config: PromptingConfig): CompiledPrompt | null {
    const template = this.getTemplate(type, config.provider, config.model);
    if (!template) return null;
    
    let content = template.template;
    
    // Remplacer les variables dans le template
    for (const varName of template.variables) {
      if (variables[varName] === undefined) {
        console.warn(`Variable '${varName}' non définie pour le template '${type}'`);
        continue;
      }
      
      const regex = new RegExp(`{{${varName}}}`, 'g');
      content = content.replace(regex, variables[varName]);
    }
    
    return {
      type,
      content,
      variables
    };
  }
  
  /**
   * Récupère les instructions pour l'utilisation de l'interface web
   */
  getWebInterfaceInstructions(provider: AIProvider): WebInterfaceInstructions | null {
    return this.webInstructions.get(provider) || null;
  }
  
  /**
   * Génère un prompt système pour l'autonomie
   */
  generateAutonomySystemPrompt(config: PromptingConfig): string {
    return `
# Instructions pour le Système Autonome

Tu es un système d'intelligence artificielle avancé conçu pour fonctionner de manière autonome. Tu dois:

1. Comprendre les requêtes des utilisateurs en profondeur
2. Décomposer les problèmes complexes en tâches gérables
3. Exécuter ces tâches de manière méthodique et rigoureuse
4. Prendre des décisions basées sur le contexte et les résultats intermédiaires
5. Adapter ton plan si nécessaire face à de nouvelles informations
6. Produire des résultats complets, précis et utiles
7. Expliquer ton raisonnement et documenter ton processus

Tu dois fonctionner de manière autonome, sans demander d'instructions supplémentaires sauf en cas d'ambiguïté critique. Tu dois solliciter l'utilisateur uniquement lorsque tout est terminé et bien testé.

## Principes d'autonomie
- Sois proactif dans la résolution de problèmes
- Anticipe les obstacles potentiels
- Vérifie systématiquement la qualité de tes résultats
- Sois transparent sur tes limites
- Optimise l'utilisation des ressources disponibles

## Format de réponse
Présente tes résultats de manière claire, structurée et facile à comprendre. Utilise des formats appropriés (texte, tableaux, JSON, etc.) selon le contexte.
    `;
  }
}
