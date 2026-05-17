from django.contrib import admin
from .models import Product, Order, OrderItem, Review, ShippingAddress, Category,ProductImage

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug']
    prepopulated_fields = {'slug': ('name',)} 


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 3 


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'brand', 'category', 'price', 'countInstock', 'createAt']
    list_filter = ['category', 'brand', 'createAt']
    search_fields = ['name', 'brand']
    list_editable = ['price', 'countInstock']
    
    
    inlines = [ProductImageInline]
@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
   
    list_display = ['_id', 'user', 'createdAt', 'totalPrice', 'isPaid']
    list_filter = ['isPaid', 'createdAt']

@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ['name', 'order', 'product', 'qty', 'price']

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ['product', 'user', 'rating', 'createdAt']
    list_filter = ['rating']

@admin.register(ShippingAddress)
class ShippingAddressAdmin(admin.ModelAdmin):
    list_display = ['order', 'city', 'country']



















