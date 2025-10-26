// Service Worker para Notificaciones Push
// Este archivo maneja las notificaciones push del navegador

const CACHE_NAME = 'admin-se-notifications-v1';
const NOTIFICATION_TAG = 'admin-se-notification';

// Instalar Service Worker
self.addEventListener('install', (event) => {
  console.log('Service Worker instalado para notificaciones');
  self.skipWaiting();
});

// Activar Service Worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker activado para notificaciones');
  event.waitUntil(self.clients.claim());
});

// Manejar mensajes del cliente principal
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
    const { title, body, icon, tag, data } = event.data;
    
    const notificationOptions = {
      body: body,
      icon: icon || '/favicon.ico',
      badge: '/favicon.ico',
      tag: tag || NOTIFICATION_TAG,
      data: data,
      requireInteraction: true, // Mantener visible hasta que el usuario interactúe
      actions: [
        {
          action: 'view',
          title: 'Ver',
          icon: '/favicon.ico'
        },
        {
          action: 'dismiss',
          title: 'Descartar',
          icon: '/favicon.ico'
        }
      ]
    };

    event.waitUntil(
      self.registration.showNotification(title, notificationOptions)
    );
  }
});

// Manejar clics en notificaciones
self.addEventListener('notificationclick', (event) => {
  console.log('Notificación clickeada:', event);
  
  event.notification.close();

  if (event.action === 'dismiss') {
    return;
  }

  // Si es click en la notificación o en "Ver"
  if (event.action === 'view' || !event.action) {
    const urlToOpen = event.notification.data?.url || '/';
    
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
        // Si ya hay una ventana abierta, enfocarla
        for (const client of clientList) {
          if (client.url.includes('administracion-se') && 'focus' in client) {
            return client.focus();
          }
        }
        
        // Si no hay ventana abierta, abrir una nueva
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
    );
  }
});

// Manejar cierre de notificaciones
self.addEventListener('notificationclose', (event) => {
  console.log('Notificación cerrada:', event);
});

// Función para mostrar notificación con diferentes tipos
function showNotificationByType(type, data) {
  let title, body, icon, tag;
  
  switch (type) {
    case 'pendiente_asignado':
      title = '📋 Nuevo Pendiente Asignado';
      body = `Se te asignó: "${data.titulo}" en ${data.localNombre}`;
      icon = '/icons/pendiente.png';
      tag = `pendiente_${data.pendienteId}`;
      break;
      
    case 'vencimiento_urgente':
      title = '⚠️ Vencimiento Urgente';
      body = `¡VENCIDO! ${data.tipoVencimiento} en ${data.localNombre}`;
      icon = '/icons/warning.png';
      tag = `vencimiento_${data.localId}_${data.tipoVencimiento}`;
      break;
      
    case 'vencimiento_proximo':
      title = '⏰ Vencimiento Próximo';
      body = `Quedan ${data.diasRestantes} días para ${data.tipoVencimiento} en ${data.localNombre}`;
      icon = '/icons/clock.png';
      tag = `vencimiento_${data.localId}_${data.tipoVencimiento}_${data.diasRestantes}`;
      break;
      
    case 'gasto_aprobado':
      title = '✅ Gasto Aprobado';
      body = `Tu gasto de $${data.monto} en ${data.localNombre} fue aprobado`;
      icon = '/icons/check.png';
      tag = `gasto_${data.gastoId}`;
      break;
      
    case 'gasto_rechazado':
      title = '❌ Gasto Rechazado';
      body = `Tu gasto de $${data.monto} en ${data.localNombre} fue rechazado`;
      icon = '/icons/cancel.png';
      tag = `gasto_${data.gastoId}`;
      break;
      
    default:
      title = '🔔 Nueva Notificación';
      body = data.mensaje || 'Tienes una nueva notificación';
      icon = '/favicon.ico';
      tag = NOTIFICATION_TAG;
  }
  
  return self.registration.showNotification(title, {
    body: body,
    icon: icon,
    badge: '/favicon.ico',
    tag: tag,
    data: {
      url: '/',
      type: type,
      ...data
    },
    requireInteraction: true,
    actions: [
      {
        action: 'view',
        title: 'Ver',
        icon: '/favicon.ico'
      },
      {
        action: 'dismiss',
        title: 'Descartar',
        icon: '/favicon.ico'
      }
    ]
  });
}

// Exportar función para uso externo
self.showNotificationByType = showNotificationByType;
