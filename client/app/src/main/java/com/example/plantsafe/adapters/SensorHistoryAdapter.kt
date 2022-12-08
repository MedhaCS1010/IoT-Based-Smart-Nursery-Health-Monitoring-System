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
import com.example.plantsafe.models.Sensor

internal class SensorHistoryAdapter(private var sensors: List<Sensor>):
    RecyclerView.Adapter<SensorHistoryAdapter.SensorHistoryViewHolder>() {

    internal inner class SensorHistoryViewHolder(itemView: View):
        RecyclerView.ViewHolder(itemView) {
        val timestampTextView: TextView = itemView.findViewById(R.id.sensor_timestamp)
        val moistureTextView: TextView = itemView.findViewById(R.id.sensor_moisture)
        val temperatureTextView: TextView = itemView.findViewById(R.id.sensor_temperature)
        val humidityTextView: TextView = itemView.findViewById(R.id.sensor_humidity)
        val lightTextView: TextView = itemView.findViewById(R.id.sensor_light)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): SensorHistoryViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.sensor_list_item, parent, false)
        return SensorHistoryViewHolder(view)
    }

    override fun onBindViewHolder(holder: SensorHistoryViewHolder, position: Int) {
        val item = sensors[position]
        holder.timestampTextView.text = item.timestamp.toString()
        holder.moistureTextView.text = "Moisture: " + item.moisture.toString()
        holder.temperatureTextView.text = "Temperature: " + item.temperature.toString()
        holder.humidityTextView.text = "Humidity: " + item.humidity.toString()
        holder.lightTextView.text = "Light: " + item.light.toString()
    }

    override fun getItemCount(): Int {
        return sensors.size
    }

    fun submitPlants(sensors: List<Sensor>) {
        this.sensors = sensors
    }

}