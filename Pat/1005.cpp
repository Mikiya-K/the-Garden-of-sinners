#define _CRT_SECURE_NO_WARNINGS
#include <stdio.h>
#include <stdlib.h>
#include <algorithm>
using namespace std;

void keynumberjudge(int k,int number[100],int flag[4617]);
bool compare(int a,int b);

int main()
{
    int k;
    scanf("%d",&k);

    int i;
    int flag[4617];
    int keynumber[4617];
    for(i=0;i<4617;i++)
    {
        flag[i]=-1;
        keynumber[i]=-1;
    }

    int number[100];
    for(i=0;i<k;i++)
    {
        scanf("%d",&number[i]);
        if(i!=k-1)
        scanf(" ");

        flag[number[i]]=0;
    }

    keynumberjudge(k,number,flag);

    int j;
    for(i=0,j=0;i<4617;i++)
    {     
        if(flag[i]==0)
        {
            keynumber[j]=i;
            j++;
        }
    }

    sort(keynumber,keynumber+j,compare);

    for(i=0;i<j;i++)
    {
        if(i!=0) printf(" ");
        printf("%d",keynumber[i]);
    }
    return 0;
}

void keynumberjudge(int k,int number[100],int flag[4617])
{
    int n;
    int i;
    for(i=0;i<k;i++)
    {
        n=number[i];

        for(;n!=1;)
        {
            if(n%2==0) 
            {
                n=n/2;
                if(flag[n]==0)
                flag[n]=1;
            }
            else       
            {
                n=(3*n+1)/2;
                if(flag[n]==0)
                flag[n]=1;
            }
        }
    }
}

bool compare(int a,int b)
{
    return a>b;
}