package com.example.plantsafe

import com.example.plantsafe.models.Plant
import retrofit2.Response
import retrofit2.http.GET
import retrofit2.http.Query

interface PlantAPI {

    @GET("plants")
    suspend fun getAllPlants(): Response<List<Plant>>

    @GET("plants?")
    suspend fun getPlantById(@Query("id") id: String): Response<Plant>


}