package com.zemic.training.repository;

import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.mybatis.spring.SqlSessionTemplate;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.core.io.ResourceLoader;
import org.springframework.core.io.support.ResourcePatternUtils;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import com.zemic.training.common.DateSourceParameters;

import javax.sql.DataSource;

@Configuration
@MapperScan(basePackages = "com.zemic.training.repository",
        sqlSessionFactoryRef = DateSourceParameters.Training.TrainingSqlSessionFactory,
        sqlSessionTemplateRef = DateSourceParameters.Training.TrainingSqlSessionTemplate)
public class RepositoryConfiguration {

    @Autowired
    Environment env;

    @Autowired
    private ResourceLoader resourceLoader;

    /**
     * 生成数据源.
     */
    @Bean(name = DateSourceParameters.Training.TrainingDataSource)
    @ConfigurationProperties(prefix = DateSourceParameters.Training.TrainingDataSourcePrefix)
    public DataSource trainingDataSource() {
        return DataSourceBuilder.create().build();
    }

    /**
     * 创建 SqlSessionFactory
     */
    @Bean(name = DateSourceParameters.Training.TrainingSqlSessionFactory)
    public SqlSessionFactory trainingSqlSessionFactory(
            @Qualifier(DateSourceParameters.Training.TrainingDataSource) DataSource dataSource) throws Exception {
        SqlSessionFactoryBean bean = new SqlSessionFactoryBean();
        bean.setDataSource(dataSource);

        bean.setMapperLocations(ResourcePatternUtils.getResourcePatternResolver(resourceLoader).
                getResources("classpath:mappers/*.xml"));
        return bean.getObject();
    }

    /**
     * 配置事务管理
     */
    @Bean(name = DateSourceParameters.Training.TrainingTransactionManagerFactory)
    public DataSourceTransactionManager trainingTransactionManagerFactory(
            @Qualifier(DateSourceParameters.Training.TrainingDataSource) DataSource dataSource) {
        return new DataSourceTransactionManager(dataSource);
    }

    @Bean(name = DateSourceParameters.Training.TrainingSqlSessionTemplate)
    public SqlSessionTemplate trainingSqlSessionTemplate(
            @Qualifier(DateSourceParameters.Training.TrainingSqlSessionFactory) SqlSessionFactory sqlSessionFactory) {
        return new SqlSessionTemplate(sqlSessionFactory);
    }
}
