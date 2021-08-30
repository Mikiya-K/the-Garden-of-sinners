#define _CRT_SECURE_NO_WARNINGS
#include <stdio.h>
#include <stdlib.h>



int calculate(int type,int n,int number[1000]);
float calculate_A4(int n,int number[1000]);

int main()
{
    int n;
    scanf("%d",&n);

    int number[1000];
    int i;
    for(i=0;i<n;i++)
    {
        scanf("%d",&number[i]);
    }

    for(i=0;i<5;i++)
    {
        if(i==3)
        {
            if(calculate_A4(n,number)==0)
            printf("N");
            else
            printf("%.1f",calculate_A4(n,number));
        }
        
        else
        {
            if(i==1)
            {
                int j;
                int count=0;
                int sum=0;

                for(j=0;j<n;j++)
                {
                    if(number[j]%5==1)
                    {
                        count++;
                        if(count%2!=0)
                        sum=sum+number[j];
                        else
                        sum=sum-number[j];
                    }
                }

                if(count==0)
                printf("N");
                else
                printf("%d",sum);
            }

            else
            {
                if(calculate(i,n,number)==0)
                printf("N");
                else
                printf("%d",calculate(i,n,number));
            }
        }

        if(i!=4)
        printf(" ");
    }

    return 0;
}

int calculate(int type,int n,int number[1000])
{
    int i;
    int sum=0;
    int count=0;
    int max=number[0];

    if(type==0)
    {
        for(i=0;i<n;i++)
        {
            if(number[i]%5==0&&number[i]%2==0)
            {
                sum=sum+number[i];
                count++;
            }
        }

        if(count==0)
        return 0;
        else   
        return sum;
    }

    else if(type==2)
    {
        for(i=0;i<n;i++)
        {
            if(number[i]%5==2)
            {
                count++;
            }
        }

        return count;
    }

    else if(type==4)
    {
        for(i=0;i<n;i++)
        {
            if(number[i]%5==4&&number[i]>max)
            {
                max=number[i];
                count++;
            }
        }

        if(count==0)
        return 0;
        else
        return max;
    }
}

float calculate_A4(int n,int number[1000])
{
    int i;
    int sum=0;
    int count=0;

    for(i=0;i<n;i++)
    {
        if(number[i]%5==3)
        {
            sum=sum+number[i];
            count++;
        }
    }
    
    if(count==0)
    return 0;
    else
    {
        float average=(float)sum/count;
        return average;
    }
}