from django import template

register = template.Library()

@register.simple_tag(takes_context=True)
def query_transform(context, **kwargs):
    """Return encoded querystring with updated parameters.
    Usage: ?{% query_transform page=2 %}
    To remove a key pass None: {% query_transform page=None %}
    """
    request = context.get('request')
    if not request:
        query = {}
    else:
        query = request.GET.copy()
    for k, v in kwargs.items():
        if v is None:
            if k in query:
                query.pop(k)
        else:
            query[k] = v
    return query.urlencode()
