#define _CRT_SECURE_NO_WARNINGS
#include <stdio.h>
#include <stdlib.h>

int main()
{
    int t;
    scanf("%d",&t);

    int i;
    long a,b,c;
    for(i=0;i<t;i++)
    {
        scanf("%ld %ld %ld",&a,&b,&c);
        
        char * result=(a+b>c?"true":"false");

        printf("Case #%d: %s\n",i+1,result);
    }

    return 0;
}