package com.example.amilimetros.ui.components

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.slideInVertically
import androidx.compose.animation.slideOutVertically
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import kotlinx.coroutines.delay

@Composable
fun CustomSnackbarWithMenu(
    message: String,
    isVisible: Boolean,
    onDismiss: () -> Unit,
    onLogout: () -> Unit,
    userName: String = "",
    modifier: Modifier = Modifier
) {
    var showMenu by remember { mutableStateOf(false) }

    // Auto-dismiss después de 5 segundos
    LaunchedEffect(isVisible) {
        if (isVisible) {
            delay(5000)
            onDismiss()
        }
    }

    AnimatedVisibility(
        visible = isVisible,
        enter = slideInVertically(initialOffsetY = { -it }) + fadeIn(),
        exit = slideOutVertically(targetOffsetY = { -it }) + fadeOut(),
        modifier = modifier
    ) {
        Surface(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            shape = RoundedCornerShape(12.dp),
            color = MaterialTheme.colorScheme.primary,
            shadowElevation = 8.dp
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(16.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(
                    horizontalArrangement = Arrangement.spacedBy(12.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier.weight(1f)
                ) {
                    Icon(
                        imageVector = Icons.Filled.CheckCircle,
                        contentDescription = null,
                        tint = MaterialTheme.colorScheme.onPrimary,
                        modifier = Modifier.size(24.dp)
                    )
                    Column {
                        Text(
                            text = message,
                            color = MaterialTheme.colorScheme.onPrimary,
                            style = MaterialTheme.typography.bodyMedium
                        )
                        if (userName.isNotEmpty()) {
                            Text(
                                text = "Usuario: $userName",
                                color = MaterialTheme.colorScheme.onPrimary.copy(alpha = 0.8f),
                                style = MaterialTheme.typography.bodySmall
                            )
                        }
                    }
                }

                // Botón de menú con opciones
                Box {
                    IconButton(
                        onClick = { showMenu = true },
                        modifier = Modifier.size(24.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Filled.MoreVert,
                            contentDescription = "Menú",
                            tint = MaterialTheme.colorScheme.onPrimary,
                            modifier = Modifier.size(20.dp)
                        )
                    }

                    DropdownMenu(
                        expanded = showMenu,
                        onDismissRequest = { showMenu = false }
                    ) {
                        DropdownMenuItem(
                            text = {
                                Row(
                                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Icon(Icons.Filled.Close, "Cerrar", tint = MaterialTheme.colorScheme.onSurface)
                                    Text("Cerrar notificación")
                                }
                            },
                            onClick = {
                                showMenu = false
                                onDismiss()
                            }
                        )

                        HorizontalDivider()

                        DropdownMenuItem(
                            text = {
                                Row(
                                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Icon(Icons.Filled.ExitToApp, "Cerrar sesión", tint = MaterialTheme.colorScheme.error)
                                    Text("Cerrar sesión", color = MaterialTheme.colorScheme.error)
                                }
                            },
                            onClick = {
                                showMenu = false
                                onDismiss()
                                onLogout()
                            }
                        )
                    }
                }
            }
        }
    }
}

// Composable para usar en todas las pantallas principales
@Composable
fun GlobalSnackbar(
    userPreferences: com.example.amilimetros.data.local.storage.UserPreferences,
    onLogout: () -> Unit,
    modifier: Modifier = Modifier,
    content: @Composable (showSnackbar: (String) -> Unit) -> Unit
) {
    var snackbarMessage by remember { mutableStateOf("") }
    var isSnackbarVisible by remember { mutableStateOf(false) }
    var userName by remember { mutableStateOf("") }

    LaunchedEffect(Unit) {
        userName = userPreferences.getNombre() ?: ""
    }

    Box(modifier = modifier.fillMaxSize()) {
        content { message ->
            snackbarMessage = message
            isSnackbarVisible = true
        }

        CustomSnackbarWithMenu(
            message = snackbarMessage,
            isVisible = isSnackbarVisible,
            onDismiss = { isSnackbarVisible = false },
            onLogout = onLogout,
            userName = userName,
            modifier = Modifier.align(Alignment.TopCenter)
        )
    }
}