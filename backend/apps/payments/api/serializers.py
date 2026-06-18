from rest_framework import serializers
from apps.payments.models import Payment



class PaymentSerializer(serializers.ModelSerializer):


    class Meta:

        model = Payment

        fields = "__all__"


        read_only_fields = [
            "user",
            "amount",
            "status",
            "transaction_id",
        ]