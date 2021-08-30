#define _CRT_NONSTDC_NO_WARNINGS
#include <stdio.h>
#include <stdlib.h>

void move(int n,int m,int a[100]);

int main()
{
    int n,m;
    scanf("%d %d",&n,&m);

    int i;
    int a[100];
    for(i=0;i<n;i++)
    {
        scanf("%d",&a[i]);
    }

    move(n,m,a);

    for(i=0;i<n;i++)
    {
        printf("%d",a[i]);
        if(i!=n-1)
        printf(" ");
    }  

    return 0;
}

void move(int n,int m,int a[100])
{
    int i,j;
    int mowei;
    for(i=0;i<m;i++)
    {
        mowei=a[n-1];
        for(j=n-2;j>=0;j--)
        {
            a[j+1]=a[j];
        }
        a[0]=mowei;
    }
}