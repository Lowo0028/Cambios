package com.example.amilimetros.ui.screen

import android.graphics.BitmapFactory
import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.asImageBitmap
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import androidx.navigation.compose.rememberNavController
import com.example.amilimetros.data.local.storage.UserPreferences
import com.example.amilimetros.data.remote.dto.ProductoDto
import com.example.amilimetros.data.repository.ProductoApiRepository
import com.example.amilimetros.data.repository.CarritoApiRepository
import com.example.amilimetros.data.repository.OrdenApiRepository
import com.example.amilimetros.ui.viewmodel.ProductViewModel
import com.example.amilimetros.ui.viewmodel.CartViewModel
import kotlinx.coroutines.launch

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ProductListScreen(
    navController: NavController = rememberNavController()
) {
    val context = LocalContext.current
    val scope = rememberCoroutineScope()
    val userPrefs = remember { UserPreferences(context) }

    val productoRepository = remember { ProductoApiRepository() }
    val carritoRepository = remember { CarritoApiRepository() }
    val ordenRepository = remember { OrdenApiRepository() }

    val productViewModel = remember { ProductViewModel(productoRepository) }
    val cartViewModel = remember { CartViewModel(carritoRepository, ordenRepository) }

    // ✅ CORRECTO: Usar collectAsState() para observar StateFlows
    val productos by productViewModel.productos.collectAsState()
    val isLoading by productViewModel.isLoading.collectAsState()
    val error by productViewModel.error.collectAsState()

    // ✅ CORRECTO: Observar mensajes del carrito
    val successMessage by cartViewModel.successMessage.collectAsState()
    val errorMessage by cartViewModel.error.collectAsState()

    var userId by remember { mutableStateOf<Long?>(null) }
    var isLoggedIn by remember { mutableStateOf(false) }

    val snackbarHostState = remember { SnackbarHostState() }

    LaunchedEffect(Unit) {
        userId = userPrefs.getUserId()
        isLoggedIn = userPrefs.getIsLoggedIn()
        println("🔍 ProductListScreen - UserId: $userId, IsLoggedIn: $isLoggedIn")
    }

    // ✅ CORRECTO: Observar cambios en los mensajes
    LaunchedEffect(successMessage) {
        successMessage?.let { message ->
            println("✅ Mostrando mensaje de éxito: $message")
            snackbarHostState.showSnackbar(
                message = message,
                duration = SnackbarDuration.Short
            )
            cartViewModel.clearMessages()
        }
    }

    LaunchedEffect(errorMessage) {
        errorMessage?.let { message ->
            println("❌ Mostrando mensaje de error: $message")
            snackbarHostState.showSnackbar(
                message = message,
                duration = SnackbarDuration.Long
            )
            cartViewModel.clearMessages()
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        Icon(Icons.Filled.Store, "Tienda")
                        Text("Productos")
                    }
                },
                navigationIcon = {
                    IconButton(onClick = { navController.popBackStack() }) {
                        Icon(Icons.Filled.ArrowBack, "Volver")
                    }
                },
                actions = {
                    IconButton(onClick = { productViewModel.cargarProductos() }) {
                        Icon(Icons.Filled.Refresh, "Recargar")
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.primaryContainer,
                    titleContentColor = MaterialTheme.colorScheme.onPrimaryContainer
                )
            )
        },
        snackbarHost = { SnackbarHost(snackbarHostState) }
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .padding(horizontal = 16.dp)
        ) {
            Spacer(Modifier.height(16.dp))

            when {
                isLoading -> Box(
                    Modifier.fillMaxSize(),
                    contentAlignment = Alignment.Center
                ) {
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        CircularProgressIndicator()
                        Text("Cargando productos...")
                    }
                }

                error != null -> Box(
                    Modifier.fillMaxSize(),
                    contentAlignment = Alignment.Center
                ) {
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        Icon(
                            Icons.Filled.Error,
                            contentDescription = null,
                            modifier = Modifier.size(64.dp),
                            tint = MaterialTheme.colorScheme.error
                        )
                        Text(
                            error!!,
                            color = MaterialTheme.colorScheme.error,
                            style = MaterialTheme.typography.bodyLarge
                        )
                        Button(onClick = { productViewModel.cargarProductos() }) {
                            Icon(Icons.Filled.Refresh, null)
                            Spacer(Modifier.width(8.dp))
                            Text("Reintentar")
                        }
                    }
                }

                productos.isEmpty() -> Box(
                    Modifier.fillMaxSize(),
                    contentAlignment = Alignment.Center
                ) {
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        Icon(
                            Icons.Filled.ShoppingCart,
                            contentDescription = null,
                            modifier = Modifier.size(80.dp),
                            tint = MaterialTheme.colorScheme.primary.copy(alpha = 0.3f)
                        )
                        Text("No hay productos disponibles")
                    }
                }

                else -> LazyColumn(
                    verticalArrangement = Arrangement.spacedBy(12.dp),
                    contentPadding = PaddingValues(vertical = 8.dp)
                ) {
                    items(productos) { product ->
                        ProductCard(
                            product = product,
                            isLoggedIn = isLoggedIn,
                            onAddToCart = {
                                if (!isLoggedIn) {
                                    scope.launch {
                                        snackbarHostState.showSnackbar(
                                            message = "⚠️ Debes iniciar sesión para agregar productos",
                                            duration = SnackbarDuration.Short
                                        )
                                    }
                                    return@ProductCard
                                }

                                userId?.let { uid ->
                                    println("🛒 Agregando producto ${product.id} para usuario $uid")
                                    cartViewModel.agregarAlCarrito(uid, product.id)
                                } ?: run {
                                    scope.launch {
                                        snackbarHostState.showSnackbar(
                                            message = "❌ Error: Usuario no identificado",
                                            duration = SnackbarDuration.Short
                                        )
                                    }
                                }
                            }
                        )
                    }
                }
            }
        }
    }
}

@Composable
private fun ProductCard(
    product: ProductoDto,
    isLoggedIn: Boolean,
    onAddToCart: () -> Unit
) {
    ElevatedCard(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    product.nombre,
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.SemiBold
                )
                Spacer(Modifier.height(4.dp))

                Text(
                    product.descripcion,
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    maxLines = 2
                )
                Spacer(Modifier.height(8.dp))

                Row(
                    horizontalArrangement = Arrangement.spacedBy(12.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(4.dp)
                    ) {
                        Icon(
                            Icons.Filled.AttachMoney,
                            contentDescription = null,
                            modifier = Modifier.size(20.dp),
                            tint = MaterialTheme.colorScheme.primary
                        )
                        Text(
                            "${"%.0f".format(product.precio)}",
                            style = MaterialTheme.typography.titleLarge,
                            color = MaterialTheme.colorScheme.primary,
                            fontWeight = FontWeight.Bold
                        )
                    }

                    AssistChip(
                        onClick = { },
                        label = { Text(product.categoria) },
                        leadingIcon = {
                            Icon(
                                Icons.Filled.Category,
                                contentDescription = null,
                                modifier = Modifier.size(16.dp)
                            )
                        }
                    )
                }

                Spacer(Modifier.height(12.dp))

                FilledTonalButton(
                    onClick = onAddToCart,
                    modifier = Modifier.fillMaxWidth(),
                    enabled = isLoggedIn
                ) {
                    Icon(
                        Icons.Filled.AddShoppingCart,
                        contentDescription = null,
                        modifier = Modifier.size(20.dp)
                    )
                    Spacer(Modifier.width(8.dp))
                    Text(if (isLoggedIn) "Agregar al Carrito" else "Inicia sesión para comprar")
                }
            }

            Spacer(Modifier.width(12.dp))

            // IMAGEN DEL PRODUCTO
            if (product.imagen != null) {
                val bitmap = remember(product.imagen) {
                    try {
                        val imageBytes = android.util.Base64.decode(
                            product.imagen,
                            android.util.Base64.DEFAULT
                        )
                        BitmapFactory.decodeByteArray(imageBytes, 0, imageBytes.size)
                    } catch (e: Exception) {
                        null
                    }
                }

                if (bitmap != null) {
                    Image(
                        bitmap = bitmap.asImageBitmap(),
                        contentDescription = product.nombre,
                        modifier = Modifier.size(100.dp),
                        contentScale = ContentScale.Crop
                    )
                } else {
                    // Placeholder si falla la decodificación
                    Surface(
                        modifier = Modifier.size(100.dp),
                        shape = RoundedCornerShape(8.dp),
                        color = MaterialTheme.colorScheme.surfaceVariant
                    ) {
                        Box(contentAlignment = Alignment.Center) {
                            Icon(
                                Icons.Filled.Image,
                                contentDescription = null,
                                modifier = Modifier.size(40.dp),
                                tint = MaterialTheme.colorScheme.primary
                            )
                        }
                    }
                }
            } else {
                // Sin imagen
                Surface(
                    modifier = Modifier.size(100.dp),
                    shape = RoundedCornerShape(8.dp),
                    color = MaterialTheme.colorScheme.surfaceVariant
                ) {
                    Box(contentAlignment = Alignment.Center) {
                        Icon(
                            Icons.Filled.ShoppingBag,
                            contentDescription = null,
                            modifier = Modifier.size(40.dp),
                            tint = MaterialTheme.colorScheme.primary
                        )
                    }
                }
            }
        }
    }
}