package com.example.plantsafe.models

data class Plant(
    val id: String,
    val name: String,
    val description: String,
    val category: String,
    val size: String,
    val sensorId: Int
)
