#define _CRT_NONSTDC_NO_WARNINGS
#include <stdio.h>
#include <stdlib.h>

void printint(char n[4]);
void printgewei(char gewei);
void printshiwei(char shiwei);
void printbaiwei(char baiwei);

int main()
{
    char n[4];
    scanf("%s",n);

    printint(n);

    return 0;
}

void printint(char n[4])
{
    int i;
    int weishu;

    for(i=0;n[i];i++);
    weishu=i;

    switch(weishu)
    {
        case 1:
        {
            printgewei(n[0]);
            break;
        }
        case 2:
        {
            printshiwei(n[0]);
            printgewei(n[1]);
            break;
        }
        case 3:
        {
            printbaiwei(n[0]);
            printshiwei(n[1]);
            printgewei(n[2]);
            break;
        }
    }
}

void printgewei(char gewei)
{
    int i;
    for(i=1;i<=(gewei-'0');i++)
    {
        printf("%c",'0'+i-0);
    }
}

void printshiwei(char shiwei)
{
    int i;
    for(i=1;i<=(shiwei-'0');i++)
    {
        printf("S");
    }
}

void printbaiwei(char baiwei)
{
    int i;
    for(i=1;i<=(baiwei-'0');i++)
    {
        printf("B");
    }
}