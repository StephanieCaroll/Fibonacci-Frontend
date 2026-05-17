from django.db import models
from django.contrib.auth.models import User

class Category(models.Model):
    name = models.CharField(max_length=200, verbose_name="Nome da Categoria")
    slug = models.SlugField(max_length=200, unique=True, null=True, blank=True)
    description = models.TextField(null=True, blank=True, verbose_name="Descrição da Categoria")
    _id = models.AutoField(primary_key=True, editable=False)

    class Meta:
        verbose_name = "Categoria"
        verbose_name_plural = "Categorias"

    def __str__(self):
        return self.name

class Product(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    name = models.CharField(max_length=200, null=True, blank=True)
    image = models.ImageField(null=True, blank=True, default="/images/placeholder.png", upload_to="images/")
    brand = models.CharField(max_length=200, null=True, blank=True, verbose_name="Artista / Artesão")
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True, verbose_name="Categoria")
    description = models.TextField(null=True, blank=True)
    rating = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    numReviews = models.IntegerField(null=True, blank=True, default=0)
    price = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    countInstock = models.IntegerField(null=True, blank=True, default=0)
    createAt = models.DateTimeField(auto_now_add=True)
    _id = models.AutoField(primary_key=True, editable=False)

    def __str__(self): 
        return f"{self.name or 'Sem nome'} | {self.brand or 'Sem marca'} | {self.price or 0.00}"

#Código antigo
#class Product(models.Model):
 #  name = models.CharField(max_length=200, null=True, blank=True)
  # brand = models.CharField(max_length=200, null=True, blank=True)
   # category = models.CharField(max_length=200, null=True, blank=True)
    ##description = models.TextField(null=True, blank=True)
    #ating = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    #numReviews = models.IntegerField(null=True, blank=True, default=0)
    #price = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    #countInstock = models.IntegerField(null=True, blank=True, default=0)
    ##_id = models.AutoField(primary_key=True, editable=False)

    #def __str__(self): 
        # f-string evita erros caso o nome ou preço estejam vazios no banco
      #  return f"{self.name or 'Sem nome'} | {self.brand or 'Sem marca'} | {self.price or 0.00}"        


# Visualização dos Produtos
class Review(models.Model):
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    name = models.CharField(max_length=200, null=True, blank=True)
    rating = models.IntegerField(null=True, blank=True)
    comment = models.TextField(null=True, blank=True)  # Corrigido: TextField (singular)
    createdAt = models.DateTimeField(auto_now_add=True)
    _id = models.AutoField(primary_key=True, editable=False)

    def __str__(self):
        return str(self.rating)
    

class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)  # Corrigido: user (minúsculo)
    paymentMethod = models.CharField(max_length=200, null=True, blank=True)
    taxPrice = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    shippingPrice = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    totalPrice = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    isPaid = models.BooleanField(default=False)
    paidAT = models.DateTimeField(auto_now_add=False, null=True, blank=True)
    isDeliver = models.BooleanField(default=False)
    deliveredAt = models.DateTimeField(auto_now_add=False, null=True, blank=True)
    createdAt = models.DateTimeField(auto_now_add=True, null=True, blank=True)  # Corrigido: DateTimeField (F maiúsculo)
    _id = models.AutoField(primary_key=True, editable=False)  # Corrigido: igual (=) em vez de menos (-)

    def __str__(self):
        return str(self.createdAt)
    
    #ao deletar um produto eu irei deletar a categoria do produto em questão, uma relação interligada.
class OrderItem(models.Model):
    product = models.ForeignKey(Product,on_delete=models.CASCADE,null=True)
    order = models.ForeignKey(Order,on_delete=models.SET_NULL,null=True)
    name = models.CharField(max_length=200,null=True,blank=True)
    qty = models.IntegerField(null=True,blank=True,default=0)
    price = models.DecimalField(max_digits=12,decimal_places=2,null=True,blank=True)
    image = models.CharField(max_length=200, null=True,blank=True)
    _id = models.AutoField(primary_key=True,editable=False)

    def __str__(self):
        return str (self.name)
    
    
class ShippingAddress(models.Model):
    order = models.OneToOneField(Order,on_delete=models.CASCADE,null=True,blank=True)
    address = models.CharField(max_length=200,null=True,blank=True)
    city = models.CharField(max_length=200, null=True,blank=True)
    postalCode = models.CharField(max_length=200,null=True,blank=True)
    country = models.CharField(max_length=200,null=True,blank=True)
    ShippingPrice = models.DecimalField(max_digits=12,decimal_places=2,null=True,blank=True)
    _id = models.AutoField(primary_key=True,editable=False)

    def __str__(self):
        return str(self.address)
    
