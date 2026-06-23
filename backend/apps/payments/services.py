import stripe
from django.conf import settings


stripe.api_key = settings.STRIPE_SECRET_KEY



def create_checkout_session(payment):

    session = stripe.checkout.Session.create(

        payment_method_types=[
            "card"
        ],


        line_items=[
            {
                "price_data": {

                    "currency": "usd",

                    "product_data": {

                        "name":
                        payment.booking.vehicle.name

                    },

                    "unit_amount":
                    int(payment.amount * 100)

                },

                "quantity": 1,

            }
        ],


        mode="payment",


        success_url=
        "http://localhost:3000/payment-success",


        cancel_url=
        "http://localhost:3000/payment-cancel",


        metadata={

            "payment_id":
            payment.id

        }

    )


    return session