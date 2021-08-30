#define _CRT_NONSTDC_NO_WARNINGS
#include <stdio.h>
#include <stdlib.h>
#include <math.h>

int issushu(int n);

int main()
{
    int n;
    scanf("%d",&n);

    int flag[100000];
    int sushu[100000];

    int i;
    for(i=2;i<=n;i++)
    {
        flag[i]=issushu(i);
    }

    int j;
    for(i=0,j=2;j<=n;j++)
    {
        if(flag[j]==1)
        {
            sushu[i]=j;
            i++;
        }
    }

    int sushudui=0;
    for(j=0;j<i-1;j++)
    {
        if((sushu[j+1]-sushu[j])==2)
        sushudui++;
    }

    printf("%d",sushudui);

    return 0;
}

int issushu(int n)
{
    int i;
    for(i=2;i<=sqrt(n);i++)
    {
        if(n%i==0)
        return 0;
    }
    return 1;
}