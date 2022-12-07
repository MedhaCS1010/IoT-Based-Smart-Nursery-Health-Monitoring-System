package com.example.plantsafe

import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

object PlantNetwork {

    val retrofit by lazy {
        Retrofit.Builder()
            .baseUrl("http://10.0.2.2:5000/")
            .addConverterFactory(GsonConverterFactory.create())
            .build()
            .create(PlantAPI::class.java)
    }

}