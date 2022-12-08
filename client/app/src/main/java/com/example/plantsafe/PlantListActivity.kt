package com.example.plantsafe

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import androidx.recyclerview.widget.LinearLayoutManager
import com.example.plantsafe.adapters.PlantListAdapter
import com.example.plantsafe.databinding.ActivityPlantListBinding
import com.example.plantsafe.models.Plant
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class PlantListActivity : AppCompatActivity() {

    private lateinit var binding: ActivityPlantListBinding
    private lateinit var plantListAdapter: PlantListAdapter
    private var plants: List<Plant> = ArrayList()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityPlantListBinding.inflate(layoutInflater)
        setContentView(binding.root)

        plantListAdapter = PlantListAdapter(plants)
        val layoutManager = LinearLayoutManager(this,
            LinearLayoutManager.VERTICAL, false)
        binding.plantsRecycler.layoutManager = layoutManager
        binding.plantsRecycler.adapter = plantListAdapter

        GlobalScope.launch(Dispatchers.IO) {
            var plantsList = fetchAllPlants()
            withContext(Dispatchers.Main) {
                if (plantsList != null) {
                    plants = plantsList
                    plantListAdapter.submitPlants(plants)
                    Log.d("plantsList", "$plants")
                    plantListAdapter.notifyDataSetChanged()
                }
            }
        }
    }

    private suspend fun fetchAllPlants(): List<Plant>? {
        val response = PlantNetwork.retrofit.getAllPlants()
        return response.body()
    }
}