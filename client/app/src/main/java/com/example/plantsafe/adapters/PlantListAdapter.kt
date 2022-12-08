package com.example.plantsafe.adapters

import android.content.Intent
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.plantsafe.PlantActivity
import com.example.plantsafe.R
import com.example.plantsafe.models.Plant

internal class PlantListAdapter(private var plants: List<Plant>):
    RecyclerView.Adapter<PlantListAdapter.PlantViewHolder>() {

    internal inner class PlantViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val plantNameTextView: TextView = itemView.findViewById(R.id.plant_list_name)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): PlantViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.plant_list_item, parent, false)
        return PlantViewHolder(view)
    }

    override fun onBindViewHolder(holder: PlantViewHolder, position: Int) {
        val item = plants[position]
        holder.plantNameTextView.text = item.name
        holder.itemView.setOnClickListener {
            val intent = Intent(holder.itemView.context, PlantActivity::class.java)
            Log.d("Plant ID", item.id)
            intent.putExtra("plantId", item.id)
            holder.itemView.context.startActivity(intent)
        }
    }

    override fun getItemCount(): Int {
        return plants.size
    }

    fun submitPlants(plants: List<Plant>) {
        this.plants = plants
    }

}