from django.template.defaulttags import register

@register.filter
def endswith(x, y):
  return x.endswith(y)

@register.filter(name='times') 
def times(number):
    return range(number)
