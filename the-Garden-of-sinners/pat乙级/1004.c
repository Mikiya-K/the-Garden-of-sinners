#define _CRT_SECURE_NO_WARNINGS
#include <stdio.h>
#include <stdlib.h>

void rank(int n,char name[100][11],char number[100][11],int grade[100]);

int main()
{
    int n;
    scanf("%d",&n);

    char name[100][11];
    char number[100][11];
    int grade[100];

    int i;
    for(i=0;i<n;i++)
    {
        scanf("%s %s %d",&name[i],&number[i],&grade[i]);
    }

    rank(n,name,number,grade);

    return 0;
}

void rank(int n,char name[100][11],char number[100][11],int grade[100])
{
    int max=grade[0];
    int maxid=0;
    int min=grade[0];
    int minid=0;

    int i;
    for(i=1;i<n;i++)
    {
        if(grade[i]>max)
        {
            max=grade[i];
            maxid=i;
        }
        if(grade[i]<min)
        {
            min=grade[i];
            minid=i;
        }
    }

    printf("%s %s\n",name[maxid],number[maxid]);
    printf("%s %s",name[minid],number[minid]);
}