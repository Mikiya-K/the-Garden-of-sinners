#define _CRT_SECURE_NO_WARNINGS
#include <stdio.h>
#include <stdlib.h>

int exist_zhishu_not0(int i,int j,int zhishu[1000]);

int main()
{
    int xishu[1000];
    int zhishu[1000];

    int i,j,k;
    for(i=0,j=0,k=0;;i++)
    {
        int number;
        char zifu;

        scanf("%d%c",&number,&zifu);

        if(i%2==0)
        {
            xishu[j]=number;
            j++;
        }
        else
        {
            zhishu[k]=number;
            k++;
        }

        if(zifu=='\n')
        break;
    }

    if(j==1&&zhishu[0]==0)
    printf("0 0");
    else
    {
        for(i=0;i<j;i++)
        {
            if(zhishu[i]!=0)
            printf("%d %d",xishu[i]*zhishu[i],zhishu[i]-1); 

            if(zhishu[i]!=0&&i!=j-1&&exist_zhishu_not0(i,j,zhishu))
            printf(" ");
        }
    }

    return 0;
}

int exist_zhishu_not0(int i,int j,int zhishu[1000])
{
    int k;
    for(k=i+1;k<j;k++)
    {
        if(zhishu[k]!=0)
        return 1;
    }
    return 0;
}