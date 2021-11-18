#include <stdio.h>
#include <stdlib.h>

int sum(char * n);
void printsum(int sum);

int main()
{
    char n[101];
    scanf("%s",n);

    printsum(sum(n));

    return 0;
}

int sum(char * n)
{
    int i;
    int sum=0;
    
    for(i=0;n[i];i++)
    {
        switch(n[i])
        {
            case '0':break;
            case '1':sum+=1;break;
            case '2':sum+=2;break;
            case '3':sum+=3;break;
            case '4':sum+=4;break;
            case '5':sum+=5;break;
            case '6':sum+=6;break;
            case '7':sum+=7;break;
            case '8':sum+=8;break;
            case '9':sum+=9;break;
        }
    }

    return sum;
}

void printsum(int sum)
{
    char string[1024];

    sprintf(string,"%d",sum);

    int i;

    for(i=0;string[i];i++)
    {
        switch(string[i])
        {
            case '0':printf("ling");break;
            case '1':printf("yi");break;
            case '2':printf("er");break;
            case '3':printf("san");break;
            case '4':printf("si");break;
            case '5':printf("wu");break;
            case '6':printf("liu");break;
            case '7':printf("qi");break;
            case '8':printf("ba");break;
            case '9':printf("jiu");break;
        }
        if(string[i+1]) printf(" ");
    }
}