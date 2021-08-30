#define _CRT_NONSTDC_NO_WARNINGS
#include <stdio.h>
#include <stdlib.h>

int judge_flag[100];

void judge_1(char string[100], int n);
void judge_2(char string[100], int n);
void judge_3(char string[100], int n);
int is_only_equal_A(int p,char string[100]);
int data_verification(int p,int t,int A_in_P_T,char string[100]);

int main()
{
    int n;
    scanf("%d", &n);

    char string[10][100];
    int i;

    for (i = 0; i < n; i++)
    {
        judge_flag[i]=-1;

        scanf("%s", string[i]);


        judge_1(string[i], i);

        if (judge_flag[i] != 0)
        judge_2(string[i], i);

        if (judge_flag[i] == -1)
        judge_3(string[i], i);


        if (judge_flag[i] == 1)
        printf("YES");
        else
        printf("NO");

        if (i != n - 1)
        printf("\n");                     
    }
}

void judge_1(char string[100], int n)
{
    int i;
    for (i = 0; string[i]; i++)
    {
        if (!(string[i] == 'P' || string[i] == 'A' || string[i] == 'T'))
        {
            judge_flag[n] = 0;
            break;
        }
    }
}

void judge_2(char string[100], int n)
{
    if(string[0]=='P'&&string[1]=='A'&&string[2]=='T'&&string[3]=='\0')
    judge_flag[n] = 1;

    int i;
    for (i = 0; string[i]; i++)
    {
        if (string[i] == 'P')
        {
            if (string[i + 1] == 'A' && string[i + 2] == 'T')
            {
                if(is_only_equal_A(i,string))
                {
                    judge_flag[n] = 1;
                    break;
                }
            }
        }
    }
}

void judge_3(char string[100], int n)
{
    int flag = 0;

    int i;
    for (i = 0; string[i]; i++)
    {
        if (string[i] == 'P' && string[i + 1] == 'A')
        {
            int j;
            for (j = 1; string[i + 1 + j] == 'A' || string[i + 1 + j] == 'T'; j++)
            {
                if (string[i + 1 + j] == 'T')
                {
                    if (i == 0 && string[i + 1 + j + 1] == '\0')
                        flag = 1;
                    else
                    {
                        flag = data_verification(i, i + 1 + j, j, string);
                        break;
                    }              
                }
            }
        }
    }
    judge_flag[n] = flag;
}

int is_only_equal_A(int p,char string[100])
{
    int i;
    int left_Acount=0;
    int right_Acount=0;

    for(i=0;i<p;i++)
    {
        if(string[i]=='A')
        left_Acount++;
        else
        return 0;
    }

    for(i=p+3;string[i];i++)
    {
        if(string[i]=='A')
        right_Acount++;
        else
        return 0;
    }

    if(left_Acount!=right_Acount)
    return 0;
    else
    return 1;
}

int data_verification(int p,int t,int A_in_P_T,char string[100])
{
    int i;
    int A_in_P=0;
    int A_inT_=0;

    for(i=0;i<p;i++)
    {
        if(string[i]!='A')
        return 0;
        A_in_P++;
    }

    for(i=t+1;string[i];i++)
    {
        if(string[i]!='A')
        return 0;
        A_inT_++;
    }

    if(A_inT_==A_in_P+(A_in_P_T-1)*A_in_P)
    return 1;
    else
    return 0;
}