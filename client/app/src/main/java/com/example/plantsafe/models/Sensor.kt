package com.example.plantsafe.models

import java.util.Date

data class Sensor(
    val moisture: Int,
    val temperature: Int,
    val humidity: Int,
    val light: Int,
    val timestamp: Date
)
