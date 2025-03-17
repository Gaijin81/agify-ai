/**
 * Réseau Neuronal d'Expérience Collective (RNEC)
 * 
 * Ce système révolutionnaire permet à l'application d'apprendre collectivement
 * des interactions de tous les utilisateurs, d'adapter dynamiquement les prompts,
 * de partager les connaissances et d'anticiper les besoins des utilisateurs.
 */

import { v4 as uuidv4 } from 'uuid';
import { AIProvider, AIModel, Conversation, Message } from '../core/types';
import { PromptType, PromptTemplate } from '../prompting/types';

// Types pour le RNEC
export interface ExperienceNode {
  id: string;
  prompt: string;
  response: string;
  effectiveness: number; // Score de 0 à 100
  metadata: {
    timestamp: Date;
    provider: string;
    model: string;
    context?: string;
    tags: string[];
  };
  connections: Array<{
    nodeId: string;
    strength: number; // Force de la connexion de 0 à 1
  }>;
}

export interface UserProfile {
  id: string;
  preferences: Record<string, any>;
  interactionHistory: Array<{
    timestamp: Date;
    nodeId: string;
    feedback?: number; // Score de -1 à 1
  }>;
  predictedNeeds: Array<{
    need: string;
    confidence: number;
    suggestedNodeIds: string[];
  }>;
}

export class CollectiveExperienceNetwork {
  private nodes: Map<string, ExperienceNode> = new Map();
  private userProfiles: Map<string, UserProfile> = new Map();
  private isInitialized: boolean = false;
  private readonly SIMILARITY_THRESHOLD = 0.7;
  
  constructor() {
    this.initialize();
  }
  
  /**
   * Initialise le réseau avec des données de base
   */
  private initialize(): void {
    if (this.isInitialized) return;
    
    // Créer quelques nœuds d'expérience initiaux
    this.createInitialNodes();
    
    this.isInitialized = true;
  }
  
  /**
   * Crée des nœuds d'expérience initiaux
   */
  private createInitialNodes(): void {
    // Nœud pour l'analyse de requêtes
    const analysisNode = this.createNode(
      "Analyse la requête utilisateur suivante et identifie l'intention principale, les entités importantes et le niveau de complexité.",
      "J'ai analysé la requête et identifié les éléments suivants: intention=recherche_information, entités=[IA, autonomie, développement], complexité=moyenne",
      85,
      {
        provider: "manus",
        model: "manus-default",
        tags: ["analyse", "requête", "intention"]
      }
    );
    
    // Nœud pour la planification de tâches
    const planningNode = this.createNode(
      "Décompose l'objectif suivant en une série de tâches exécutables avec leurs dépendances: créer une application web de gestion de tâches.",
      "J'ai décomposé l'objectif en tâches exécutables: 1) Conception de l'interface utilisateur, 2) Création de la base de données, 3) Développement du backend, 4) Intégration frontend-backend, 5) Tests et déploiement.",
      90,
      {
        provider: "manus",
        model: "manus-default",
        tags: ["planification", "tâches", "décomposition"]
      }
    );
    
    // Nœud pour l'exécution de code
    const codeExecutionNode = this.createNode(
      "Écris une fonction JavaScript qui trie un tableau d'objets par une propriété spécifiée.",
      "```javascript\nfunction sortArrayByProperty(array, property) {\n  return [...array].sort((a, b) => {\n    if (a[property] < b[property]) return -1;\n    if (a[property] > b[property]) return 1;\n    return 0;\n  });\n}\n```",
      95,
      {
        provider: "manus",
        model: "manus-default",
        tags: ["code", "javascript", "tri"]
      }
    );
    
    // Créer des connexions entre les nœuds
    this.connectNodes(analysisNode.id, planningNode.id, 0.8);
    this.connectNodes(planningNode.id, codeExecutionNode.id, 0.5);
  }
  
  /**
   * Crée un nouveau nœud d'expérience
   */
  private createNode(
    prompt: string,
    response: string,
    effectiveness: number,
    metadata: {
      provider: string;
      model: string;
      context?: string;
      tags: string[];
    }
  ): ExperienceNode {
    const node: ExperienceNode = {
      id: uuidv4(),
      prompt,
      response,
      effectiveness,
      metadata: {
        timestamp: new Date(),
        provider: metadata.provider,
        model: metadata.model,
        context: metadata.context,
        tags: metadata.tags
      },
      connections: []
    };
    
    this.nodes.set(node.id, node);
    return node;
  }
  
  /**
   * Connecte deux nœuds avec une force spécifiée
   */
  private connectNodes(sourceId: string, targetId: string, strength: number): void {
    const sourceNode = this.nodes.get(sourceId);
    const targetNode = this.nodes.get(targetId);
    
    if (!sourceNode || !targetNode) return;
    
    // Ajouter la connexion au nœud source
    sourceNode.connections.push({
      nodeId: targetId,
      strength
    });
    
    // Ajouter la connexion au nœud cible (bidirectionnel)
    targetNode.connections.push({
      nodeId: sourceId,
      strength
    });
    
    // Mettre à jour les nœuds
    this.nodes.set(sourceId, sourceNode);
    this.nodes.set(targetId, targetNode);
  }
  
  /**
   * Calcule la similarité entre deux textes (implémentation simplifiée)
   */
  private calculateSimilarity(text1: string, text2: string): number {
    // Dans une implémentation réelle, utiliser des techniques plus avancées
    // comme le cosinus de similarité sur des embeddings de texte
    
    // Simplification: compter les mots communs
    const words1 = new Set(text1.toLowerCase().split(/\s+/));
    const words2 = new Set(text2.toLowerCase().split(/\s+/));
    
    let commonWords = 0;
    for (const word of words1) {
      if (words2.has(word)) commonWords++;
    }
    
    return commonWords / Math.max(words1.size, words2.size);
  }
  
  /**
   * Trouve le nœud le plus similaire à un prompt donné
   */
  findSimilarNode(prompt: string): ExperienceNode | null {
    let bestMatch: ExperienceNode | null = null;
    let highestSimilarity = 0;
    
    for (const node of this.nodes.values()) {
      const similarity = this.calculateSimilarity(prompt, node.prompt);
      
      if (similarity > highestSimilarity && similarity >= this.SIMILARITY_THRESHOLD) {
        highestSimilarity = similarity;
        bestMatch = node;
      }
    }
    
    return bestMatch;
  }
  
  /**
   * Ajoute une nouvelle expérience au réseau
   */
  addExperience(
    prompt: string,
    response: string,
    effectiveness: number,
    metadata: {
      provider: string;
      model: string;
      context?: string;
      tags: string[];
    }
  ): ExperienceNode {
    // Vérifier s'il existe déjà un nœud similaire
    const similarNode = this.findSimilarNode(prompt);
    
    if (similarNode && effectiveness > similarNode.effectiveness) {
      // Mettre à jour le nœud existant avec la meilleure réponse
      similarNode.response = response;
      similarNode.effectiveness = effectiveness;
      similarNode.metadata = {
        ...similarNode.metadata,
        timestamp: new Date()
      };
      
      this.nodes.set(similarNode.id, similarNode);
      return similarNode;
    } else {
      // Créer un nouveau nœud
      const newNode = this.createNode(prompt, response, effectiveness, metadata);
      
      // Connecter avec des nœuds similaires
      for (const node of this.nodes.values()) {
        if (node.id !== newNode.id) {
          const similarity = this.calculateSimilarity(prompt, node.prompt);
          
          if (similarity >= this.SIMILARITY_THRESHOLD / 2) {
            this.connectNodes(newNode.id, node.id, similarity);
          }
        }
      }
      
      return newNode;
    }
  }
  
  /**
   * Récupère ou crée un profil utilisateur
   */
  getUserProfile(userId: string): UserProfile {
    let profile = this.userProfiles.get(userId);
    
    if (!profile) {
      profile = {
        id: userId,
        preferences: {},
        interactionHistory: [],
        predictedNeeds: []
      };
      
      this.userProfiles.set(userId, profile);
    }
    
    return profile;
  }
  
  /**
   * Enregistre une interaction utilisateur
   */
  recordUserInteraction(userId: string, nodeId: string, feedback?: number): void {
    const profile = this.getUserProfile(userId);
    
    profile.interactionHistory.push({
      timestamp: new Date(),
      nodeId,
      feedback
    });
    
    // Mettre à jour le profil
    this.userProfiles.set(userId, profile);
    
    // Mettre à jour l'efficacité du nœud en fonction du feedback
    if (feedback !== undefined) {
      const node = this.nodes.get(nodeId);
      
      if (node) {
        // Ajuster l'efficacité en fonction du feedback (-1 à 1)
        const adjustment = feedback * 5; // -5 à +5
        node.effectiveness = Math.max(0, Math.min(100, node.effectiveness + adjustment));
        
        this.nodes.set(nodeId, node);
      }
    }
    
    // Mettre à jour les besoins prédits
    this.updatePredictedNeeds(userId);
  }
  
  /**
   * Met à jour les besoins prédits pour un utilisateur
   */
  private updatePredictedNeeds(userId: string): void {
    const profile = this.getUserProfile(userId);
    
    // Simplification: prédire les besoins en fonction des interactions récentes
    const recentInteractions = profile.interactionHistory
      .slice(-5) // 5 dernières interactions
      .map(interaction => this.nodes.get(interaction.nodeId))
      .filter((node): node is ExperienceNode => node !== undefined);
    
    // Collecter les tags des interactions récentes
    const tagCounts: Record<string, number> = {};
    
    for (const node of recentInteractions) {
      for (const tag of node.metadata.tags) {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      }
    }
    
    // Trouver les tags les plus fréquents
    const topTags = Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(entry => entry[0]);
    
    // Prédire les besoins en fonction des tags
    profile.predictedNeeds = topTags.map(tag => {
      // Trouver les nœuds avec ce tag
      const nodesWithTag = Array.from(this.nodes.values())
        .filter(node => node.metadata.tags.includes(tag))
        .sort((a, b) => b.effectiveness - a.effectiveness)
        .slice(0, 3);
      
      return {
        need: `Besoin lié à "${tag}"`,
        confidence: tagCounts[tag] / recentInteractions.length,
        suggestedNodeIds: nodesWithTag.map(node => node.id)
      };
    });
    
    // Mettre à jour le profil
    this.userProfiles.set(userId, profile);
  }
  
  /**
   * Améliore un prompt en fonction de l'expérience collective
   */
  enhancePrompt(prompt: string, userId?: string): string {
    // Trouver un nœud similaire
    const similarNode = this.findSimilarNode(prompt);
    
    if (!similarNode) {
      return prompt; // Pas d'amélioration possible
    }
    
    // Si un utilisateur est spécifié, enregistrer l'interaction
    if (userId) {
      this.recordUserInteraction(userId, similarNode.id);
    }
    
    // Améliorer le prompt en fonction du nœud trouvé
    // Dans une implémentation réelle, utiliser des techniques plus avancées
    
    // Simplification: combiner le prompt original avec des éléments du nœud similaire
    const enhancedPrompt = `
${prompt}

Pour référence, voici des éléments qui pourraient être utiles:
- Contexte: ${similarNode.metadata.context || 'Non spécifié'}
- Aspects importants: ${similarNode.metadata.tags.join(', ')}
    `.trim();
    
    return enhancedPrompt;
  }
  
  /**
   * Suggère des prompts en fonction du profil utilisateur
   */
  suggestPrompts(userId: string): Array<{
    prompt: string;
    confidence: number;
    description: string;
  }> {
    const profile = this.getUserProfile(userId);
    
    // Utiliser les besoins prédits pour suggérer des prompts
    return profile.predictedNeeds.flatMap(need => {
      return need.suggestedNodeIds.map(nodeId => {
        const node = this.nodes.get(nodeId);
        
        if (!node) return null;
        
        return {
          prompt: node.prompt,
          confidence: need.confidence * (node.effectiveness / 100),
          description: `Basé sur votre intérêt pour "${need.need.replace('Besoin lié à "', '').replace('"', '')}"`
        };
      }).filter((suggestion): suggestion is NonNullable<typeof suggestion> => suggestion !== null);
    });
  }
  
  /**
   * Génère un rapport sur l'état du réseau
   */
  generateNetworkReport(): {
    nodeCount: number;
    userCount: number;
    topNodes: Array<{
      id: string;
      effectiveness: number;
      tags: string[];
      connectionCount: number;
    }>;
    topTags: Array<{
      tag: string;
      count: number;
    }>;
  } {
    // Compter les occurrences de tags
    const tagCounts: Record<string, number> = {};
    
    for (const node of this.nodes.values()) {
      for (const tag of node.metadata.tags) {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      }
    }
    
    // Trouver les tags les plus fréquents
    const topTags = Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([tag, count]) => ({ tag, count }));
    
    // Trouver les nœuds les plus efficaces
    const topNodes = Array.from(this.nodes.values())
      .sort((a, b) => b.effectiveness - a.effectiveness)
      .slice(0, 10)
      .map(node => ({
        id: node.id,
        effectiveness: node.effectiveness,
        tags: node.metadata.tags,
        connectionCount: node.connections.length
      }));
    
    return {
      nodeCount: this.nodes.size,
      userCount: this.userProfiles.size,
      topNodes,
      topTags
    };
  }
  
  /**
   * Exporte les données du réseau (pour sauvegarde ou analyse)
   */
  exportNetworkData(): {
    nodes: ExperienceNode[];
    userProfiles: UserProfile[];
  } {
    return {
      nodes: Array.from(this.nodes.values()),
      userProfiles: Array.from(this.userProfiles.values())
    };
  }
  
  /**
   * Importe des données dans le réseau
   */
  importNetworkData(data: {
    nodes: ExperienceNode[];
    userProfiles: UserProfile[];
  }): void {
    // Importer les nœuds
    for (const node of data.nodes) {
      this.nodes.set(node.id, node);
    }
    
    // Importer les profils utilisateur
    for (const profile of data.userProfiles) {
      this.userProfiles.set(profile.id, profile);
    }
  }
}
