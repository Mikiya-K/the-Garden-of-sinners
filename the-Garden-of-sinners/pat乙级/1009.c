#define _CRT_NONSTDC_NO_WARNINGS
#include <stdio.h>
#include <stdlib.h>

int main()
{
    char string[81];
    gets(string);
    
    char word[40][81];

    int i,j,k;
    for(i=0,j=0,k=0;string[i];i++)
    {
        if(string[i]==' ')
        {
            word[j][k]='\0';
            j++;
            k=0;
            i++;
        }
        word[j][k]=string[i];
        k++;
        if(string[i+1]=='\0')
            word[j][k]='\0';
    }

    for(i=j;i>=0;i--)
    {
        printf("%s",word[i]);
        if(i!=0) printf(" ");
    }

    return 0;
}