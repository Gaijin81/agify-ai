import React, { useState } from 'react';
import Header from '../components/layout/Header';
import { Button } from '../components/ui/Button';
import { TaskStatus } from '../lib/core/types';

// Données simulées pour le tableau de bord
const mockRequests = [
  {
    id: 'req-001',
    content: 'Analyser les données de ventes du premier trimestre et créer un rapport',
    timestamp: new Date(2025, 2, 15, 10, 30),
    status: TaskStatus.COMPLETED,
    tasks: [
      { id: 'task-001', description: 'Analyser et comprendre la requête utilisateur', status: TaskStatus.COMPLETED, progress: 100 },
      { id: 'task-002', description: 'Planifier les étapes nécessaires', status: TaskStatus.COMPLETED, progress: 100 },
      { id: 'task-003', description: 'Exécuter les actions nécessaires', status: TaskStatus.COMPLETED, progress: 100 },
      { id: 'task-004', description: 'Synthétiser les résultats', status: TaskStatus.COMPLETED, progress: 100 }
    ]
  },
  {
    id: 'req-002',
    content: 'Rechercher les dernières avancées en intelligence artificielle et résumer les points clés',
    timestamp: new Date(2025, 2, 16, 14, 45),
    status: TaskStatus.RUNNING,
    tasks: [
      { id: 'task-005', description: 'Analyser et comprendre la requête utilisateur', status: TaskStatus.COMPLETED, progress: 100 },
      { id: 'task-006', description: 'Planifier les étapes nécessaires', status: TaskStatus.COMPLETED, progress: 100 },
      { id: 'task-007', description: 'Exécuter les actions nécessaires', status: TaskStatus.RUNNING, progress: 65 },
      { id: 'task-008', description: 'Synthétiser les résultats', status: TaskStatus.PENDING, progress: 0 }
    ]
  },
  {
    id: 'req-003',
    content: 'Créer un plan marketing pour le lancement d\'un nouveau produit',
    timestamp: new Date(2025, 2, 17, 9, 15),
    status: TaskStatus.PENDING,
    tasks: [
      { id: 'task-009', description: 'Analyser et comprendre la requête utilisateur', status: TaskStatus.PENDING, progress: 0 },
      { id: 'task-010', description: 'Planifier les étapes nécessaires', status: TaskStatus.PENDING, progress: 0 },
      { id: 'task-011', description: 'Exécuter les actions nécessaires', status: TaskStatus.PENDING, progress: 0 },
      { id: 'task-012', description: 'Synthétiser les résultats', status: TaskStatus.PENDING, progress: 0 }
    ]
  }
];

export default function DashboardPage() {
  const [activeRequest, setActiveRequest] = useState(mockRequests[1]);

  // Fonction pour formater la date
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Fonction pour obtenir la classe de couleur en fonction du statut
  const getStatusColorClass = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.COMPLETED:
        return 'bg-green-100 text-green-800';
      case TaskStatus.RUNNING:
        return 'bg-blue-100 text-blue-800';
      case TaskStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800';
      case TaskStatus.FAILED:
        return 'bg-red-100 text-red-800';
      case TaskStatus.CANCELLED:
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Fonction pour obtenir le libellé du statut en français
  const getStatusLabel = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.COMPLETED:
        return 'Terminé';
      case TaskStatus.RUNNING:
        return 'En cours';
      case TaskStatus.PENDING:
        return 'En attente';
      case TaskStatus.FAILED:
        return 'Échoué';
      case TaskStatus.CANCELLED:
        return 'Annulé';
      default:
        return 'Inconnu';
    }
  };

  // Calcul du pourcentage global de progression
  const calculateOverallProgress = (tasks: any[]) => {
    if (tasks.length === 0) return 0;
    const totalProgress = tasks.reduce((sum, task) => sum + task.progress, 0);
    return Math.round(totalProgress / tasks.length);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
          <p className="mt-2 text-gray-600">
            Suivez l'état et la progression de vos requêtes et tâches autonomes.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Liste des requêtes */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                <h2 className="text-lg font-medium text-gray-900">Vos requêtes</h2>
              </div>
              <ul className="divide-y divide-gray-200">
                {mockRequests.map((request) => (
                  <li 
                    key={request.id}
                    className={`px-4 py-4 hover:bg-gray-50 cursor-pointer ${activeRequest.id === request.id ? 'bg-gray-50' : ''}`}
                    onClick={() => setActiveRequest(request)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="truncate">
                        <p className="text-sm font-medium text-gray-900 truncate">{request.content}</p>
                        <p className="text-sm text-gray-500">{formatDate(request.timestamp)}</p>
                      </div>
                      <div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColorClass(request.status)}`}>
                          {getStatusLabel(request.status)}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Détails de la requête sélectionnée */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                <h2 className="text-lg font-medium text-gray-900">Détails de la requête</h2>
              </div>
              <div className="px-4 py-5 sm:p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900">{activeRequest.content}</h3>
                  <div className="mt-2 flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                      Créée le {formatDate(activeRequest.timestamp)}
                    </p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColorClass(activeRequest.status)}`}>
                      {getStatusLabel(activeRequest.status)}
                    </span>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-700">Progression globale</h4>
                    <span className="text-sm font-medium text-gray-700">{calculateOverallProgress(activeRequest.tasks)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{ width: `${calculateOverallProgress(activeRequest.tasks)}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-4">Tâches</h4>
                  <div className="space-y-4">
                    {activeRequest.tasks.map((task) => (
                      <div key={task.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm font-medium text-gray-900">{task.description}</p>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColorClass(task.status)}`}>
                            {getStatusLabel(task.status)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-500">Progression</span>
                          <span className="text-xs font-medium text-gray-700">{task.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div 
                            className="bg-blue-600 h-1.5 rounded-full" 
                            style={{ width: `${task.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {activeRequest.status === TaskStatus.COMPLETED && (
                  <div className="mt-6">
                    <Button 
                      variant="primary" 
                      onClick={() => window.location.href = `/results/${activeRequest.id}`}
                    >
                      Voir les résultats
                    </Button>
                  </div>
                )}

                {activeRequest.status === TaskStatus.RUNNING && (
                  <div className="mt-6">
                    <Button 
                      variant="outline" 
                      onClick={() => alert('Fonctionnalité non implémentée')}
                    >
                      Annuler la requête
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
