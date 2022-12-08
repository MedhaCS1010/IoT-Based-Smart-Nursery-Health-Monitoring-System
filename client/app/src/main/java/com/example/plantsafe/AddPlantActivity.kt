package com.example.plantsafe

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.widget.Toast
import com.example.plantsafe.databinding.ActivityAddPlantBinding
import com.example.plantsafe.models.Plant
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class AddPlantActivity : AppCompatActivity() {

    private lateinit var binding: ActivityAddPlantBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityAddPlantBinding.inflate(layoutInflater)
        setContentView(binding.root)

        binding.plantAddButton.setOnClickListener {
            GlobalScope.launch(Dispatchers.IO) {
                val addedPlant = addPlant()
                withContext(Dispatchers.Main) {
                    if (addedPlant != null) {
                        Toast.makeText(this@AddPlantActivity, "Plant Added!", Toast.LENGTH_SHORT)
                            .show()
                    }
                    finish()
                }
            }
        }
    }

    private suspend fun addPlant(): Plant? {
        val name = binding.plantNameInput.text.toString()
        val description = binding.plantDescriptionInput.text.toString()
        val category = binding.plantCategoryInput.text.toString()
        val size = binding.plantSizeInput.selectedItem.toString()
        val sensorId = binding.plantSensorInput.text.toString().toInt()

        val plant = Plant("", name, description, category, size, sensorId)

        val response = PlantNetwork.retrofit.addNewPlant(plant)
        return response.body()
    }
}