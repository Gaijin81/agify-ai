import React from 'react';
import Header from '../components/layout/Header';
import { Button } from '../components/ui/Button';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Transformez vos IA en systèmes autonomes
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            AGI Wrapper permet de transformer des IA comme ChatGPT et Claude en systèmes autonomes capables d'exécuter des tâches complexes sans intervention humaine continue.
          </p>
          <div className="mt-8 flex justify-center">
            <Button 
              variant="primary" 
              size="lg"
              onClick={() => window.location.href = '/conversation'}
            >
              Commencer une conversation
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="ml-4"
              onClick={() => window.location.href = '/settings'}
            >
              Configurer vos API
            </Button>
          </div>
        </div>

        <div className="mt-20">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center">
            Comment ça fonctionne
          </h2>
          <div className="mt-12 grid gap-8 grid-cols-1 md:grid-cols-3">
            <div className="bg-white shadow overflow-hidden rounded-lg p-6">
              <div className="text-lg font-medium text-indigo-600 mb-2">1. Connectez vos API</div>
              <p className="text-gray-500">
                Configurez vos clés API pour OpenAI (ChatGPT) ou Anthropic (Claude) pour commencer à utiliser leurs capacités.
              </p>
            </div>
            <div className="bg-white shadow overflow-hidden rounded-lg p-6">
              <div className="text-lg font-medium text-indigo-600 mb-2">2. Soumettez votre demande</div>
              <p className="text-gray-500">
                Décrivez ce que vous souhaitez accomplir, peu importe la complexité. Notre système décompose automatiquement votre demande en tâches exécutables.
              </p>
            </div>
            <div className="bg-white shadow overflow-hidden rounded-lg p-6">
              <div className="text-lg font-medium text-indigo-600 mb-2">3. Obtenez des résultats</div>
              <p className="text-gray-500">
                Le système exécute les tâches de manière autonome et vous notifie une fois le travail terminé, avec des résultats complets et vérifiés.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-20">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center">
            Fonctionnalités principales
          </h2>
          <div className="mt-12 grid gap-8 grid-cols-1 md:grid-cols-2">
            <div className="bg-white shadow overflow-hidden rounded-lg p-6">
              <div className="text-lg font-medium text-indigo-600 mb-2">Exécution autonome</div>
              <p className="text-gray-500">
                Le système décompose les tâches complexes en sous-tâches gérables et les exécute de manière autonome, sans nécessiter d'intervention humaine continue.
              </p>
            </div>
            <div className="bg-white shadow overflow-hidden rounded-lg p-6">
              <div className="text-lg font-medium text-indigo-600 mb-2">Support multi-modèles</div>
              <p className="text-gray-500">
                Compatible avec les modèles d'OpenAI (GPT-4, GPT-3.5) et d'Anthropic (Claude), vous permettant de choisir le modèle le plus adapté à vos besoins.
              </p>
            </div>
            <div className="bg-white shadow overflow-hidden rounded-lg p-6">
              <div className="text-lg font-medium text-indigo-600 mb-2">Suivi en temps réel</div>
              <p className="text-gray-500">
                Suivez la progression de vos tâches en temps réel grâce à notre tableau de bord intuitif, avec des mises à jour détaillées à chaque étape.
              </p>
            </div>
            <div className="bg-white shadow overflow-hidden rounded-lg p-6">
              <div className="text-lg font-medium text-indigo-600 mb-2">Résultats vérifiés</div>
              <p className="text-gray-500">
                Le système vérifie automatiquement les résultats avant de les présenter, garantissant des réponses de haute qualité et fiables.
              </p>
            </div>
          </div>
        </div>
      </main>
      <footer className="bg-white mt-24 border-t border-gray-200">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
          <div className="mt-8 md:mt-0">
            <p className="text-center text-base text-gray-400">
              &copy; 2025 AGI Wrapper. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
