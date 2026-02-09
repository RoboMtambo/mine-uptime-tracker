#!/usr/bin/env python
import os
import django
import json

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mine_track.settings')
django.setup()

from equipment.models import Equipment
from equipment.serializers import EquipmentSerializer

# Get all equipment
equipment = Equipment.objects.all()
serializer = EquipmentSerializer(equipment, many=True)
print("Equipment Response Format:")
print(json.dumps(serializer.data[:1], indent=2))
print(f"\nTotal equipment: {len(serializer.data)}")
print("\nAll equipment:")
print(json.dumps(serializer.data, indent=2))
