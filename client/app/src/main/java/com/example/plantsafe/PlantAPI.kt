package com.example.plantsafe

import com.example.plantsafe.models.Plant
import com.example.plantsafe.models.Sensor
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.Path
import retrofit2.http.Query

interface PlantAPI {

    @GET("plants")
    suspend fun getAllPlants(): Response<List<Plant>>

    @GET("/plants/{plantId}")
    suspend fun getPlantById(@Path("plantId") plantId: String): Response<Plant>

    @POST("add")
    suspend fun addNewPlant(@Body plant: Plant): Response<Plant>

    @GET("all/{plantId}")
    suspend fun getSensorData(@Path("plantId") plantId: String): Response<Sensor>

    @GET("water/{plantId}")
    suspend fun waterPlant(@Path("plantId") plantId: String): Response<Boolean>

    @GET("sensors/{plantId}")
    suspend fun getSensorHistory(@Path("plantId") plantId: String): Response<List<Sensor>>
}