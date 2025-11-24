package com.example.amilimetros.ui.screen

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import com.example.amilimetros.ui.viewmodel.CartViewModel
import com.example.amilimetros.data.local.storage.UserPreferences
import kotlinx.coroutines.launch

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CartScreen(
    navController: NavController,
    cartViewModel: CartViewModel,
    userPreferences: UserPreferences
) {
    val scope = rememberCoroutineScope()
    val items by cartViewModel.items.collectAsState()
    val total by cartViewModel.total.collectAsState()
    val isLoading by cartViewModel.isLoading.collectAsState()
    val error by cartViewModel.error.collectAsState()
    val successMessage by cartViewModel.successMessage.collectAsState()
    val checkoutSuccess by cartViewModel.checkoutSuccess.collectAsState()

    var userId by remember { mutableStateOf<Long?>(null) }
    var showDeleteDialog by remember { mutableStateOf(false) }
    var showCheckoutDialog by remember { mutableStateOf(false) }

    // Snackbar state
    val snackbarHostState = remember { SnackbarHostState() }

    // 🔥 CARGAR CARRITO AL INICIAR
    LaunchedEffect(Unit) {
        userId = userPreferences.getUserId()
        println("🛒 CartScreen - UserId: $userId")
        userId?.let {
            println("🔄 Cargando carrito para usuario: $it")
            cartViewModel.cargarCarrito(it)
        }
    }

    // 🔥 MANEJAR CHECKOUT EXITOSO
    LaunchedEffect(checkoutSuccess) {
        if (checkoutSuccess) {
            snackbarHostState.showSnackbar(
                message = "¡Compra realizada con éxito!",
                duration = SnackbarDuration.Short
            )
            navController.navigate("order_history") {
                popUpTo("cart") { inclusive = true }
            }
            cartViewModel.resetCheckoutSuccess()
        }
    }

    // 🔥 MANEJAR ERRORES
    LaunchedEffect(error) {
        error?.let {
            println("❌ Error en carrito: $it")
            snackbarHostState.showSnackbar(
                message = it,
                duration = SnackbarDuration.Long
            )
            cartViewModel.clearMessages()
        }
    }

    // 🔥 MANEJAR MENSAJES DE ÉXITO
    LaunchedEffect(successMessage) {
        successMessage?.let {
            println("✅ Mensaje de éxito: $it")
            snackbarHostState.showSnackbar(
                message = it,
                duration = SnackbarDuration.Short
            )
            cartViewModel.clearMessages()
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Mi Carrito") },
                navigationIcon = {
                    IconButton(onClick = { navController.popBackStack() }) {
                        Icon(Icons.Default.ArrowBack, "Volver")
                    }
                },
                actions = {
                    if (items.isNotEmpty()) {
                        IconButton(onClick = { showDeleteDialog = true }) {
                            Icon(Icons.Default.Delete, "Vaciar carrito")
                        }
                    }
                    // 🔥 BOTÓN DE REFRESH
                    IconButton(onClick = {
                        userId?.let { cartViewModel.cargarCarrito(it) }
                    }) {
                        Icon(Icons.Default.Refresh, "Recargar")
                    }
                }
            )
        },
        snackbarHost = { SnackbarHost(snackbarHostState) }
    ) { paddingValues ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
        ) {
            when {
                isLoading -> {
                    CircularProgressIndicator(
                        modifier = Modifier.align(Alignment.Center)
                    )
                }
                items.isEmpty() -> {
                    Column(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(16.dp),
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.Center
                    ) {
                        Icon(
                            imageVector = Icons.Default.ShoppingCart,
                            contentDescription = null,
                            modifier = Modifier.size(120.dp),
                            tint = MaterialTheme.colorScheme.primary.copy(alpha = 0.3f)
                        )
                        Spacer(modifier = Modifier.height(16.dp))
                        Text(
                            text = "Tu carrito está vacío",
                            style = MaterialTheme.typography.titleLarge
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            text = "Agrega productos para comenzar",
                            style = MaterialTheme.typography.bodyMedium,
                            color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
                        )
                        Spacer(modifier = Modifier.height(24.dp))
                        Button(onClick = { navController.navigate("products") }) {
                            Text("Ver Productos")
                        }
                    }
                }
                else -> {
                    Column(
                        modifier = Modifier.fillMaxSize()
                    ) {
                        // 🔥 INFO DE DEBUG (opcional, puedes removerlo después)
                        if (userId != null) {
                            Text(
                                "Usuario: $userId | Items: ${items.size}",
                                style = MaterialTheme.typography.labelSmall,
                                modifier = Modifier.padding(8.dp)
                            )
                        }

                        LazyColumn(
                            modifier = Modifier
                                .weight(1f)
                                .fillMaxWidth(),
                            contentPadding = PaddingValues(16.dp),
                            verticalArrangement = Arrangement.spacedBy(12.dp)
                        ) {
                            items(items, key = { it.id ?: it.productoId }) { item ->
                                CartItemCard(
                                    item = item,
                                    onUpdateQuantity = { newQuantity ->
                                        userId?.let { uid ->
                                            item.id?.let { itemId ->
                                                println("📝 Actualizando cantidad: $itemId -> $newQuantity")
                                                cartViewModel.actualizarCantidad(itemId, newQuantity, uid)
                                            }
                                        }
                                    },
                                    onRemove = {
                                        userId?.let { uid ->
                                            item.id?.let { itemId ->
                                                println("🗑️ Eliminando item: $itemId")
                                                cartViewModel.eliminarItem(itemId, uid)
                                            }
                                        }
                                    }
                                )
                            }
                        }

                        Surface(
                            shadowElevation = 8.dp,
                            tonalElevation = 2.dp
                        ) {
                            Column(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(16.dp)
                            ) {
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween
                                ) {
                                    Text(
                                        text = "Total:",
                                        style = MaterialTheme.typography.titleLarge
                                    )
                                    Text(
                                        text = "$${String.format("%,.0f", total)}",
                                        style = MaterialTheme.typography.titleLarge,
                                        color = MaterialTheme.colorScheme.primary
                                    )
                                }
                                Spacer(modifier = Modifier.height(16.dp))

                                Button(
                                    onClick = { showCheckoutDialog = true },
                                    modifier = Modifier.fillMaxWidth(),
                                    enabled = !isLoading && items.isNotEmpty()
                                ) {
                                    if (isLoading) {
                                        CircularProgressIndicator(
                                            modifier = Modifier.size(20.dp),
                                            color = MaterialTheme.colorScheme.onPrimary,
                                            strokeWidth = 2.dp
                                        )
                                        Spacer(Modifier.width(8.dp))
                                        Text("Procesando...")
                                    } else {
                                        Icon(Icons.Default.ShoppingCart, null)
                                        Spacer(modifier = Modifier.width(8.dp))
                                        Text("Proceder a Compra")
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    // 🔥 DIÁLOGO DE CONFIRMACIÓN PARA VACIAR
    if (showDeleteDialog) {
        AlertDialog(
            onDismissRequest = { showDeleteDialog = false },
            title = { Text("Vaciar Carrito") },
            text = { Text("¿Estás seguro de que deseas vaciar todo el carrito?") },
            confirmButton = {
                TextButton(
                    onClick = {
                        userId?.let {
                            println("🗑️ Vaciando carrito del usuario: $it")
                            cartViewModel.vaciarCarrito(it)
                        }
                        showDeleteDialog = false
                    }
                ) {
                    Text("Sí, vaciar")
                }
            },
            dismissButton = {
                TextButton(onClick = { showDeleteDialog = false }) {
                    Text("Cancelar")
                }
            }
        )
    }

    // 🔥 DIÁLOGO DE CONFIRMACIÓN PARA COMPRA
    if (showCheckoutDialog) {
        AlertDialog(
            onDismissRequest = { showCheckoutDialog = false },
            icon = {
                Icon(
                    Icons.Default.ShoppingCart,
                    contentDescription = null,
                    tint = MaterialTheme.colorScheme.primary
                )
            },
            title = { Text("Confirmar Compra") },
            text = {
                Column {
                    Text("¿Deseas confirmar tu compra?")
                    Spacer(Modifier.height(8.dp))
                    Text(
                        "Total: $${String.format("%,.0f", total)}",
                        style = MaterialTheme.typography.titleMedium,
                        color = MaterialTheme.colorScheme.primary
                    )
                    Spacer(Modifier.height(4.dp))
                    Text(
                        "${items.size} producto(s)",
                        style = MaterialTheme.typography.bodyMedium
                    )
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        userId?.let {
                            println("💳 Procesando compra para usuario: $it")
                            cartViewModel.procederACompra(it)
                        }
                        showCheckoutDialog = false
                    },
                    enabled = !isLoading
                ) {
                    Text("Confirmar")
                }
            },
            dismissButton = {
                TextButton(onClick = { showCheckoutDialog = false }) {
                    Text("Cancelar")
                }
            }
        )
    }
}

@Composable
fun CartItemCard(
    item: com.example.amilimetros.data.remote.dto.CarritoItemDto,
    onUpdateQuantity: (Int) -> Unit,
    onRemove: () -> Unit
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(12.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Surface(
                modifier = Modifier.size(80.dp),
                shape = MaterialTheme.shapes.medium,
                color = MaterialTheme.colorScheme.primaryContainer
            ) {
                Box(contentAlignment = Alignment.Center) {
                    Icon(
                        imageVector = Icons.Default.ShoppingBag,
                        contentDescription = null,
                        modifier = Modifier.size(40.dp),
                        tint = MaterialTheme.colorScheme.primary
                    )
                }
            }

            Spacer(modifier = Modifier.width(12.dp))

            Column(
                modifier = Modifier.weight(1f)
            ) {
                Text(
                    text = item.productoNombre,
                    style = MaterialTheme.typography.titleMedium
                )
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = "$${String.format("%,.0f", item.productoPrecio)} c/u",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
                )
                Spacer(modifier = Modifier.height(8.dp))

                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        IconButton(
                            onClick = {
                                if (item.cantidad > 1) {
                                    onUpdateQuantity(item.cantidad - 1)
                                }
                            },
                            modifier = Modifier.size(32.dp)
                        ) {
                            Icon(Icons.Default.Remove, "Disminuir")
                        }

                        Text(
                            text = "${item.cantidad}",
                            style = MaterialTheme.typography.titleMedium,
                            modifier = Modifier.padding(horizontal = 12.dp)
                        )

                        IconButton(
                            onClick = { onUpdateQuantity(item.cantidad + 1) },
                            modifier = Modifier.size(32.dp)
                        ) {
                            Icon(Icons.Default.Add, "Aumentar")
                        }
                    }

                    IconButton(onClick = onRemove) {
                        Icon(
                            Icons.Default.Delete,
                            "Eliminar",
                            tint = MaterialTheme.colorScheme.error
                        )
                    }
                }
            }
        }
    }
}