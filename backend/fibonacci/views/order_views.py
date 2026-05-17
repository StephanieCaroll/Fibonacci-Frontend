from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from fibonacci.models import Product, Order, OrderItem, ShippingAddress
from fibonacci.serializers import OrderSerializer

from datetime import datetime

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def addOrderItems(request):
    user = request.user
    data = request.data
    
    orderItems = data.get('orderItems', [])

    if not orderItems or len(orderItems) == 0:
        return Response({'detail': 'Nenhum item no pedido'}, status=status.HTTP_400_BAD_REQUEST)
    
    else:
        
        order = Order.objects.create(
            user=user,
            paymentMethod=data['paymentMethod'],
            taxPrice=data['taxPrice'],
            shippingPrice=data['shippingPrice'],
            totalPrice=data['totalPrice']
        )

       
        ShippingAddress.objects.create(
            order=order,
            address=data['shippingAddress']['address'],
            city=data['shippingAddress']['city'],
            postalCode=data['shippingAddress']['postalCode'],
            country=data['shippingAddress']['country'],
        )

        
        for i in orderItems:
            product = Product.objects.get(_id=i['_id'])

            item = OrderItem.objects.create(
                product=product,
                order=order,
                name=product.name,
                qty=i['qty'],
                price=i['price'],
                image=product.image.url if product.image else ''
            )

            
            product.countInStock -= item.qty
            product.save()

        
        serializer = OrderSerializer(order, many=False)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getOrderById(request, pk):
    user = request.user
    try:
        order = Order.objects.get(_id=pk)
        
        
        if user.is_staff or order.user == user:
            serializer = OrderSerializer(order, many=False)
            return Response(serializer.data)
        else:
            return Response({'detail': 'Não autorizado para visualizar este pedido'}, 
                            status=status.HTTP_401_UNAUTHORIZED)
            
    except Order.DoesNotExist:
        return Response({'detail': 'Pedido não encontrado'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateOrderToPaid(request, pk):
    try:
        order = Order.objects.get(_id=pk)
        
        
        order.isPaid = True
        order.paidAt = datetime.now()
        order.save()
        
        return Response({'detail': 'Pedido foi pago com sucesso!'}, status=status.HTTP_200_OK)
        
    except Order.DoesNotExist:
        return Response({'detail': 'Pedido não encontrado'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getMyOrders(request):
    user = request.user
    
    orders = user.order_set.all().order_by('-_id')
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)