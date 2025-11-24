package com.example.amilimetros.ui.screen

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import com.example.amilimetros.data.local.storage.UserPreferences
import com.example.amilimetros.ui.components.CustomSnackbarWithMenu
import kotlinx.coroutines.launch

@Composable
fun HomeScreen(
    onNavigateToLogin: () -> Unit,
    onNavigateToProducts: () -> Unit,
    onNavigateToAnimals: () -> Unit,
    onNavigateToCart: () -> Unit,
    onNavigateToProfile: () -> Unit,
    onNavigateToLocation: () -> Unit,
    onNavigateToAdmin: () -> Unit
) {
    val context = LocalContext.current
    val scope = rememberCoroutineScope()
    val userPrefs = remember { UserPreferences(context) }

    var isLoggedIn by remember { mutableStateOf(false) }
    var isAdmin by remember { mutableStateOf(false) }
    var userName by remember { mutableStateOf("") }

    // Estado para el snackbar
    var showSnackbar by remember { mutableStateOf(false) }
    var snackbarMessage by remember { mutableStateOf("") }

    LaunchedEffect(Unit) {
        isLoggedIn = userPrefs.getIsLoggedIn()
        isAdmin = userPrefs.getIsAdmin()
        userName = userPrefs.getNombre() ?: ""

        // Mostrar snackbar de bienvenida si está logueado
        if (isLoggedIn) {
            snackbarMessage = "¡Bienvenido de vuelta!"
            showSnackbar = true
        }
    }

    val bg = MaterialTheme.colorScheme.background

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(bg)
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(16.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // HEADER
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                Text(
                    text = "🐾 A Milímetros de tu hogar",
                    style = MaterialTheme.typography.headlineSmall,
                    fontWeight = FontWeight.Bold,
                    textAlign = TextAlign.Center
                )

                Icon(
                    imageVector = if (isLoggedIn) Icons.Filled.Person else Icons.Filled.PersonOff,
                    contentDescription = if (isLoggedIn) "Usuario Logueado" else "Usuario no Logueado",
                    tint = if (isLoggedIn) MaterialTheme.colorScheme.primary
                    else MaterialTheme.colorScheme.outline
                )
            }

            // BIENVENIDA
            ElevatedCard(modifier = Modifier.fillMaxWidth()) {
                Column(
                    modifier = Modifier.padding(16.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    if (isLoggedIn) {
                        Text(
                            "¡Hola, $userName!",
                            style = MaterialTheme.typography.titleLarge,
                            fontWeight = FontWeight.Bold
                        )
                        Spacer(Modifier.height(4.dp))
                    }

                    Text(
                        "Bienvenido a nuestra tienda de mascotas",
                        style = MaterialTheme.typography.titleMedium,
                        textAlign = TextAlign.Center
                    )
                    Spacer(Modifier.height(8.dp))
                    Text(
                        "Encuentra productos para tus mascotas y adopta animales en busca de hogar",
                        style = MaterialTheme.typography.bodyMedium,
                        textAlign = TextAlign.Center
                    )
                }
            }

            Spacer(Modifier.height(8.dp))

            // BOTONES PRINCIPALES
            if (isLoggedIn) {
                // USUARIO LOGUEADO
                ElevatedCard(modifier = Modifier.fillMaxWidth()) {
                    Column(
                        modifier = Modifier.padding(16.dp),
                        verticalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        Text("¿Qué deseas hacer?", style = MaterialTheme.typography.titleMedium)

                        Button(onClick = onNavigateToProducts, modifier = Modifier.fillMaxWidth()) {
                            Icon(Icons.Filled.Store, null)
                            Spacer(Modifier.width(8.dp))
                            Text("Ver Productos")
                        }

                        Button(onClick = onNavigateToAnimals, modifier = Modifier.fillMaxWidth()) {
                            Icon(Icons.Filled.Pets, null)
                            Spacer(Modifier.width(8.dp))
                            Text("Animales en Adopción")
                        }

                        OutlinedButton(onClick = onNavigateToCart, modifier = Modifier.fillMaxWidth()) {
                            Icon(Icons.Filled.ShoppingCart, null)
                            Spacer(Modifier.width(8.dp))
                            Text("Mi Carrito")
                        }

                        OutlinedButton(onClick = onNavigateToProfile, modifier = Modifier.fillMaxWidth()) {
                            Icon(Icons.Filled.Person, null)
                            Spacer(Modifier.width(8.dp))
                            Text("Mi Perfil")
                        }

                        OutlinedButton(onClick = onNavigateToLocation, modifier = Modifier.fillMaxWidth()) {
                            Icon(Icons.Filled.LocationOn, null)
                            Spacer(Modifier.width(8.dp))
                            Text("Nuestra Ubicación")
                        }

                        if (isAdmin) {
                            HorizontalDivider()
                            Button(
                                onClick = onNavigateToAdmin,
                                modifier = Modifier.fillMaxWidth(),
                                colors = ButtonDefaults.buttonColors(
                                    containerColor = MaterialTheme.colorScheme.tertiary
                                )
                            ) {
                                Icon(Icons.Filled.AdminPanelSettings, null)
                                Spacer(Modifier.width(8.dp))
                                Text("Panel de Administrador")
                            }
                        }

                        HorizontalDivider()

                        OutlinedButton(
                            onClick = {
                                scope.launch {
                                    userPrefs.logout()
                                    isLoggedIn = false
                                    snackbarMessage = "Sesión cerrada"
                                    showSnackbar = true
                                }
                            },
                            modifier = Modifier.fillMaxWidth(),
                            colors = ButtonDefaults.outlinedButtonColors(
                                contentColor = MaterialTheme.colorScheme.error
                            )
                        ) {
                            Icon(Icons.Filled.Logout, null)
                            Spacer(Modifier.width(8.dp))
                            Text("Cerrar Sesión")
                        }
                    }
                }
            } else {
                // USUARIO NO LOGUEADO
                ElevatedCard(modifier = Modifier.fillMaxWidth()) {
                    Column(
                        modifier = Modifier.padding(16.dp),
                        verticalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        Text(
                            "Para acceder a todas las funciones",
                            style = MaterialTheme.typography.titleMedium,
                            textAlign = TextAlign.Center,
                            modifier = Modifier.fillMaxWidth()
                        )

                        Button(onClick = onNavigateToLogin, modifier = Modifier.fillMaxWidth()) {
                            Icon(Icons.Filled.Login, null)
                            Spacer(Modifier.width(8.dp))
                            Text("Iniciar Sesión")
                        }
                    }
                }
            }
        }

        // 🔥 SNACKBAR CON MENÚ EN LA PARTE SUPERIOR
        CustomSnackbarWithMenu(
            message = snackbarMessage,
            isVisible = showSnackbar,
            onDismiss = { showSnackbar = false },
            onLogout = {
                scope.launch {
                    userPrefs.logout()
                    isLoggedIn = false
                    snackbarMessage = "Sesión cerrada correctamente"
                    showSnackbar = true
                }
            },
            userName = userName,
            modifier = Modifier.align(Alignment.TopCenter)
        )
    }
}