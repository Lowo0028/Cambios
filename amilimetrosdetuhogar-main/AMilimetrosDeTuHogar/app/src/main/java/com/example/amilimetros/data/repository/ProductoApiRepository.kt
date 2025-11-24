package com.example.amilimetros.data.repository

import com.example.amilimetros.data.remote.ApiService
import com.example.amilimetros.data.remote.dto.ProductoDto

class ProductoApiRepository {

    private val api = ApiService.createCatalogoService()

    suspend fun getProductos(): Result<List<ProductoDto>> {
        return try {
            val response = api.getProductos()
            if (response.isSuccessful && response.body() != null) {
                Result.success(response.body()!!)
            } else {
                Result.failure(Exception("Error al obtener productos"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun getProductoById(id: Long): Result<ProductoDto> {
        return try {
            val response = api.getProductoById(id)
            if (response.isSuccessful && response.body() != null) {
                Result.success(response.body()!!)
            } else {
                Result.failure(Exception("Producto no encontrado"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun eliminar(productoId: Long, emailAdmin: String): Result<Unit> {
        return try {
            val response = api.eliminarProducto(productoId, emailAdmin)
            if (response.isSuccessful) {
                Result.success(Unit)
            } else {
                val errorMsg = response.errorBody()?.string() ?: "Error al eliminar producto"
                Result.failure(Exception(errorMsg))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}