package com.example.plantsafe

import android.os.Bundle
import android.util.Log
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.ImageView
import android.widget.TextView
import androidx.cardview.widget.CardView
import com.example.plantsafe.databinding.FragmentHomeBinding
import com.example.plantsafe.models.Plant
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import okhttp3.Dispatcher
import retrofit2.Retrofit


class HomeFragment : Fragment() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
    }

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val view = inflater.inflate(R.layout.fragment_home, container, false)

        val newPlantButton = view.findViewById<Button>(R.id.small_add_plant)

        GlobalScope.launch(Dispatchers.IO) {
            val plants = getAllPlants()
            if (plants != null) {
                withContext(Dispatchers.Main) {
                    setPlantDetails(plants)
                }
                Log.d("Plant Response", "$plants")
            }
        }

        return view
    }

    private suspend fun getAllPlants(): List<Plant>? {
        var plants: List<Plant>? = null
        val plantsResponse = PlantNetwork.retrofit.getAllPlants()
        plants = plantsResponse.body()
        return plants
    }

    private fun setPlantDetails(plants: List<Plant>?) {
        val sp1 = view?.findViewById<TextView>(R.id.small_plant1_name)
        val sp2 = view?.findViewById<TextView>(R.id.small_plant2_name)
        val sp3 = view?.findViewById<TextView>(R.id.small_plant3_name)

        sp1?.text = plants?.get(0)?.name ?: "Some Plant"
        sp2?.text = plants?.get(1)?.name ?: "Some Plant"
        sp3?.text = plants?.get(2)?.name ?: "Some Plant"
    }
}