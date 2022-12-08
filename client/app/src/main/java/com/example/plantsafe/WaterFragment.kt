package com.example.plantsafe

import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.Toast
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.launch

class WaterFragment : Fragment() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
    }

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val view = inflater.inflate(R.layout.fragment_water, container, false)

        val waterButton = view.findViewById<Button>(R.id.water_button)
        waterButton.setOnClickListener {
            GlobalScope.launch(Dispatchers.Main) {
                val plantWatered = waterPlant()
                if (plantWatered != null && plantWatered == true) {
                    Toast.makeText(view.context, "Plant watered!", Toast.LENGTH_SHORT)
                        .show()
                }
            }
        }

        return view
    }

    private suspend fun waterPlant(): Boolean? {
        val response = PlantNetwork.retrofit.waterPlant("63909784f1f900cf312a7d22")
        return response.body()
    }
}