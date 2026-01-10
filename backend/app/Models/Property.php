<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Property extends Model
{
    protected $fillable = [
        'user_id',
        'month_id',
        'primary_category',
        'property_type',

        'bedroom',
        'bathroom',
        'balcony',
        'floor',
        'gender',
        'size',

        'division',
        'district',
        'area',
        'subarea',
        'sector_no',
        'road_no',
        'house_no',

        'contact',

        'price',
        'price_type',

        'status',
        'admin_status',

        'electricity',
        'water',
        'security',
        'gas',
        'lift',
    ];

    /* ✅ APPEND ATTRIBUTES FOR API */
    protected $appends = [
        'title',
        'monthText',
        'categoryText',
    ];

    /* ===============================
       RELATION
    =============================== */
    public function images()
    {
        return $this->hasMany(PropertyImage::class);
    }

    /* ===============================
       CATEGORY TEXT (FIXED)
    =============================== */
    public function getCategoryTextAttribute()
    {
        return match ((int) $this->primary_category) {
            1 => 'Family',
            2 => 'Bachelor',
            3 => 'Office',
            4 => 'Sublet',
            5 => 'Hostel',
            default => '',
        };
    }

    /* ===============================
       MONTH TEXT (FIXED)
    =============================== */
    public function getMonthTextAttribute()
    {
        $months = [
            1 => 'January', 2 => 'February', 3 => 'March',
            4 => 'April', 5 => 'May', 6 => 'June',
            7 => 'July', 8 => 'August', 9 => 'September',
            10 => 'October', 11 => 'November', 12 => 'December',
        ];

        return $months[$this->month_id] ?? '';
    }

    /* ===============================
       TITLE
    =============================== */
    public function getTitleAttribute()
    {
        // Use office-friendly wording when category is Office (3)
        if ((int) $this->primary_category === 3) {
            $roomText = match ((int) $this->bedroom) {
                0 => 'Office space',
                1 => 'Office room',
                default => $this->bedroom . ' Office rooms',
            };

            $titlePrefix = $roomText;
        } else {
            $bedroomText = match ((int) $this->bedroom) {
                1 => 'Single Bedroom',
                2 => 'Double Bedroom',
                3 => 'Triple Bedroom',
                default => $this->bedroom . ' Bedroom',
            };

            $titlePrefix = "{$bedroomText} {$this->property_type}";
        }

        $subarea = $this->subarea ? $this->subarea . ', ' : '';
        $city = $this->district ?? 'Dhaka';

        return "{$titlePrefix} To-let / Rent from {$this->monthText} for {$this->categoryText} in {$subarea}{$this->area}, {$city}";
    }

        public function unlockedByUsers()
    {
        return $this->belongsToMany(
            \App\Models\User::class,
            'property_unlocks'
        )->withTimestamps();
    }

}
