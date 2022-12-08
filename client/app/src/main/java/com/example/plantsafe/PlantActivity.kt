package com.example.plantsafe

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import androidx.recyclerview.widget.LinearLayoutManager
import com.example.plantsafe.adapters.SensorHistoryAdapter
import com.example.plantsafe.databinding.ActivityPlantBinding
import com.example.plantsafe.models.Sensor
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Dispatchers.Main
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class PlantActivity : AppCompatActivity() {

    private lateinit var binding: ActivityPlantBinding
    private var sensors: List<Sensor> = ArrayList()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityPlantBinding.inflate(layoutInflater)
        setContentView(binding.root)

        val plantId = intent.extras?.get("plantId") as String
        Log.d("Plant ID", plantId)

        val layoutManager = LinearLayoutManager(this,
            LinearLayoutManager.VERTICAL, false)
        val adapter = SensorHistoryAdapter(sensors)
        binding.sensorValuesRecycler.layoutManager = layoutManager
        binding.sensorValuesRecycler.adapter = adapter

        GlobalScope.launch(Dispatchers.IO) {
            val response1 = PlantNetwork.retrofit.getPlantById(plantId)
            if (response1.isSuccessful) {
                val plant = response1.body()
                Log.d("Plant Response", plant.toString())
                withContext(Dispatchers.Main) {
                    binding.plantDisplayName.text = plant?.name
                    binding.plantDisplayCategory.text = plant?.category
                    binding.plantDisplayDescription.text = plant?.description
                }
            }

            val response2 = PlantNetwork.retrofit.getSensorData(plantId)
            if (response2.isSuccessful) {
                val sensor = response2.body()
                withContext(Dispatchers.Main) {
                    binding.moistureProgress.progress = sensor?.moisture?.div(4096) ?: 0;
                    binding.temperatureProgress.progress = sensor?.temperature?.div(50) ?: 0
                    binding.humidityProgress.progress = sensor?.humidity?: 0
                    binding.lightProgress.progress = sensor?.light?.div(2048) ?: 0;

                    binding.moistureValue.text = sensor?.moisture.toString()
                    binding.temperatureValue.text = sensor?.temperature.toString()
                    binding.humidityValue.text = sensor?.humidity.toString()
                    binding.lightValue.text = sensor?.light.toString()
                }
            }

            val response3 = PlantNetwork.retrofit.getSensorHistory(plantId)
            if (response3.isSuccessful) {
                val sensors = response3.body()
                withContext(Main) {
                    if (sensors != null) {
                        adapter.submitPlants(sensors)
                        adapter.notifyDataSetChanged()
                    }
                }
            }
        }
    }
}